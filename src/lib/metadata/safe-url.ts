import { lookup } from "node:dns/promises";
import net from "node:net";
import { MetadataError } from "./types";

const blockedHostnames = new Set(["localhost", "localhost.localdomain"]);

export async function assertPublicHttpUrl(rawUrl: string) {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new MetadataError("Enter a valid public URL.", {
      status: 400,
      code: "invalid_url"
    });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new MetadataError("Only public http and https URLs can be checked.", {
      status: 400,
      code: "blocked_url_protocol"
    });
  }

  const hostname = parsed.hostname.toLowerCase();
  if (blockedHostnames.has(hostname) || hostname.endsWith(".local")) {
    throw new MetadataError("Local and private URLs cannot be checked.", {
      status: 400,
      code: "blocked_private_url"
    });
  }

  if (net.isIP(hostname)) {
    if (isPrivateAddress(hostname)) {
      throw new MetadataError("Local and private URLs cannot be checked.", {
        status: 400,
        code: "blocked_private_url"
      });
    }
    return parsed;
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length) {
    throw new MetadataError("The URL hostname could not be resolved.", {
      status: 400,
      code: "unresolved_url"
    });
  }

  if (addresses.some((address) => isPrivateAddress(address.address))) {
    throw new MetadataError("Local and private URLs cannot be checked.", {
      status: 400,
      code: "blocked_private_url"
    });
  }

  return parsed;
}

export function isPrivateAddress(address: string) {
  if (net.isIPv4(address)) return isPrivateIpv4(address);
  if (net.isIPv6(address)) return isPrivateIpv6(address);
  return true;
}

function isPrivateIpv4(address: string) {
  const parts = address.split(".").map(Number);
  const [a, b] = parts;
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return true;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function isPrivateIpv6(address: string) {
  const value = address.toLowerCase();
  return (
    value === "::1" ||
    value === "::" ||
    value.startsWith("fc") ||
    value.startsWith("fd") ||
    value.startsWith("fe80") ||
    value.startsWith("::ffff:127.") ||
    value.startsWith("::ffff:10.") ||
    value.startsWith("::ffff:192.168.")
  );
}

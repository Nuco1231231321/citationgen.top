import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Database,
  FileText,
  Flask,
  ListChecks,
  MagnifyingGlass,
  PencilSimpleLine,
  WarningCircle,
  Wrench
} from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "@/components/JsonLd";
import { toolClusters, formatLinks } from "@/lib/navigation";
import type { GeneratorFormat, GeneratorSlug } from "@/lib/formats";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "引用生成器工具：APA、MLA、Chicago 等",
  description:
    "选择 APA、MLA、Chicago、ACS、AMA、IEEE、Vancouver、CSE、Turabian 和 Harvard 引用生成器，查看来源标签、缺失字段提示和可编辑字段。",
  alternates: {
    canonical: absoluteUrl("/tools/")
  },
  openGraph: {
    title: "引用生成器工具：APA、MLA、Chicago 等",
    description:
      "按写作场景选择引用格式，并使用带来源检查和可编辑字段的引用生成器。",
    url: absoluteUrl("/tools/")
  }
};

const clusterIcons: Record<string, typeof Flask> = {
  "Science and medical": Flask,
  "Engineering": Wrench,
  "Humanities": BookOpenText,
  "Common author-date styles": FileText
};

const clusterCopy: Record<string, { title: string; description: string }> = {
  "Science and medical": {
    title: "科学与医学写作",
    description: "适合期刊论文、实验报告、医学课程和需要 DOI、NLM 期刊缩写检查的资料。"
  },
  Engineering: {
    title: "工程与计算机科学",
    description: "适合编号引用、会议论文、技术报告和工程类课程作业。"
  },
  Humanities: {
    title: "人文与学生论文",
    description: "适合 Works Cited、脚注、参考书目和需要清楚区分容器信息的来源。"
  },
  "Common author-date styles": {
    title: "常见作者-日期格式",
    description: "适合社科、教育、商业和国际课程里最常见的作者-日期引用要求。"
  }
};

const quickStyles = formatLinks(["apa", "mla", "chicago", "acs", "ama", "ieee"]);

const citationModeLabels: Record<GeneratorFormat["citationMode"], string> = {
  "author-date": "作者-日期",
  numeric: "编号引用",
  note: "脚注/尾注"
};

const formatUseCases: Record<GeneratorSlug, string> = {
  ama: "医学、护理、公共卫生和生物医学写作常用。",
  acs: "化学、材料科学、实验报告和期刊文章常用。",
  cse: "生物、生态、环境科学和科学写作课程常用。",
  ieee: "工程、计算机科学、会议论文和技术文档常用。",
  turabian: "历史、人文课程和学生论文脚注体系常用。",
  chicago: "人文、出版写作和需要作者-日期或脚注体系的论文常用。",
  mla: "文学、语言、写作课和 Works Cited 页面常用。",
  vancouver: "医学期刊、临床资料和紧凑编号引用常用。",
  harvard: "社科、商业、教育和国际大学作业常用。",
  apa: "心理学、教育、社科和研究论文作者-日期引用常用。"
};

const trustChecks = [
  {
    title: "来源标签",
    body: "CrossRef、Google Books、URL metadata、NLM 或手动输入会在结果旁边保留标记。",
    icon: Database
  },
  {
    title: "缺失字段提示",
    body: "作者、日期、页码、DOI、ISBN 或 URL 缺失时，页面会先提醒再让你复制。",
    icon: WarningCircle
  },
  {
    title: "可编辑元数据",
    body: "查到结果后仍可修改标题、作者、日期、卷期、页码等字段，再重新生成。",
    icon: PencilSimpleLine
  },
  {
    title: "无需注册",
    body: "核心引用生成、复制和手动输入流程免费开放，适合快速完成课程和研究任务。",
    icon: ListChecks
  }
];

const workflowSteps = [
  "选择格式",
  "粘贴 DOI、ISBN、URL 或标题",
  "检查来源标签与缺失字段",
  "编辑后复制引用"
];

const toolFaqs = [
  {
    question: "我应该选择哪个引用生成器？",
    answer:
      "先看作业或期刊要求。如果没有明确说明，社科和教育常用 APA，文学和写作课常用 MLA，历史和人文常用 Chicago 或 Turabian，医学常用 AMA 或 Vancouver，化学常用 ACS，工程和计算机科学常用 IEEE。"
  },
  {
    question: "这些工具会自动编造缺失的引用数据吗？",
    answer:
      "不会。工具会使用公开元数据来源查找信息；如果缺少作者、日期、页码、DOI 或其他关键字段，会显示缺失提示，让你手动确认或补充。"
  },
  {
    question: "查到引用后还能编辑吗？",
    answer:
      "可以。每个生成器都保留可编辑字段，你可以修正标题大小写、作者顺序、出版日期、卷期、页码、URL 或 DOI 后再复制。"
  },
  {
    question: "医学、科学和工程资料更适合哪些格式？",
    answer:
      "医学和公共卫生通常从 AMA 或 Vancouver 开始；化学和材料科学通常用 ACS；生物和环境科学可看 CSE；工程、计算机科学和会议论文通常用 IEEE。"
  },
  {
    question: "这些引用工具是免费的吗？",
    answer:
      "是的。常用引用格式、元数据查询、手动输入、结果编辑和复制都可以直接使用，不需要注册账号。"
  }
];

export default function ToolsPage() {
  const toolCount = toolClusters.reduce((count, cluster) => count + cluster.slugs.length, 0);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "免费引用生成器工具",
          description: `${toolCount} 个免费引用生成器，支持来源标签、缺失字段提示和可编辑字段。`,
          url: absoluteUrl("/tools/")
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: toolFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer
            }
          }))
        }}
      />

      <section className="site-shell py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-dim">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-ink transition-colors">
                首页
              </Link>
            </li>
            <li aria-hidden="true" className="text-faint">/</li>
            <li className="font-medium text-ink">引用工具</li>
          </ol>
        </nav>
        <div className="tools-hero">
          <div className="tools-hero-copy">
            <p className="home-kicker">引用工具</p>
            <h1 className="font-editorial mt-3 text-balance text-[34px] leading-[1.12] text-ink md:text-[52px]">
              选择合适的引用生成器
            </h1>
            <p className="mt-4 max-w-[64ch] text-pretty text-[16px] leading-7 text-dim">
              从 APA、MLA、Chicago、ACS、AMA、IEEE 等格式开始，粘贴来源后生成可编辑引用。页面会显示数据来源、缺失字段和可复制结果。
            </p>
            <div className="hero-action-row">
              <Link href="/apa-citation-generator/" className="action-primary">
                从 APA 开始
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <a href="#style-picker" className="action-secondary">
                查看全部格式
              </a>
            </div>
          </div>
          <aside className="tools-hero-panel" aria-label="引用生成流程">
            <div className="tools-panel-top">
              <span className="tools-panel-icon" aria-hidden="true">
                <MagnifyingGlass size={21} />
              </span>
              <div>
                <p>最快路径</p>
                <strong>先选格式，再检查来源</strong>
              </div>
            </div>
            <ol className="tools-flow-list">
              {workflowSteps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
            <div className="tools-panel-note">
              <span>{toolCount} 种格式</span>
              <p>适合课程作业、实验报告、论文草稿和研究资料整理。</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="style-picker" className="site-shell tools-section" aria-labelledby="quick-style-heading">
        <div className="tools-section-header">
          <div>
            <p className="home-kicker">快速选择</p>
            <h2 id="quick-style-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
              常用格式先放到手边。
            </h2>
          </div>
          <p>
            如果你已经知道要求，用这些快捷入口直接进入对应生成器；如果不确定，再看下面的写作场景分组。
          </p>
        </div>
        <div className="tools-quick-grid">
          {quickStyles.map((format) => (
            <Link key={format.slug} href={format.href} className="tools-quick-card group">
              <span className="tools-quick-code">{format.label}</span>
              <span>
                <strong>{format.label} 引用生成器</strong>
                <small>{formatUseCases[format.slug]}</small>
              </span>
              <ArrowRight
                aria-hidden="true"
                size={18}
                className="text-faint group-hover:text-ink transition-colors"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="site-shell tools-trust-section" aria-labelledby="tools-trust-heading">
        <div className="tools-trust-copy">
          <p className="home-kicker">可信检查</p>
          <h2 id="tools-trust-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
            不是只给一个答案，而是让你看到答案从哪里来。
          </h2>
        </div>
        <div className="tools-trust-grid">
          {trustChecks.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="tools-trust-card">
                <span aria-hidden="true">
                  <Icon size={20} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="site-shell tools-section" aria-labelledby="tools-clusters-heading">
        <div className="tools-section-header">
          <div>
            <p className="home-kicker">按场景选择</p>
            <h2 id="tools-clusters-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
              按写作场景选择引用格式。
            </h2>
          </div>
          <p>
            引用格式的价值不在“多”，而在是否匹配你的课程、学科或投稿要求。先按场景缩小范围，再进入具体生成器。
          </p>
        </div>

        {toolClusters.map((cluster) => {
          const generators = formatLinks(cluster.slugs);
          const Icon = clusterIcons[cluster.title] ?? FileText;
          const display = clusterCopy[cluster.title] ?? {
            title: cluster.title,
            description: cluster.description
          };
          return (
            <article key={cluster.title} className="tools-cluster">
              <div className="tools-cluster-header">
                <div className="tools-cluster-icon">
                  <Icon aria-hidden="true" size={20} />
                </div>
                <div>
                  <h3>{display.title}</h3>
                  <p>{display.description}</p>
                </div>
              </div>
              <div className="tools-format-grid">
                {generators.map((format) => (
                  <Link
                    key={format.slug}
                    href={format.href}
                    className="tools-format-card group"
                  >
                    <span className="tools-format-topline">
                      <span className="tools-format-code">{format.label}</span>
                      <span>{citationModeLabels[format.citationMode]}</span>
                    </span>
                    <strong>{format.label} 引用生成器</strong>
                    <small>{format.edition}</small>
                    <p>{formatUseCases[format.slug]}</p>
                    <span className="tools-format-footer">
                      打开工具
                      <ArrowRight
                        aria-hidden="true"
                        size={16}
                        className="text-faint group-hover:text-ink transition-colors"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="site-shell tools-faq-section" aria-labelledby="tools-faq-heading">
        <div className="tools-faq-copy">
          <p className="home-kicker">常见问题</p>
          <h2 id="tools-faq-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
            选择引用工具前的常见问题。
          </h2>
          <p>
            先解决格式选择、数据可信度和编辑流程三个关键问题，再进入生成器会更快。
          </p>
        </div>
        <div className="tools-faq-list">
          {toolFaqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                <span>{faq.question}</span>
                <ArrowRight
                  aria-hidden="true"
                  size={18}
                />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

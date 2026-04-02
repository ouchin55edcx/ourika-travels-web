import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className={className ?? "mb-4 text-sm font-medium text-gray-500"}
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link href={item.href} className="transition-colors hover:text-gray-900">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-gray-900" : undefined}>{item.label}</span>
                )}
                {!isLast ? <span aria-hidden="true" className="text-gray-300">{">"}</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}

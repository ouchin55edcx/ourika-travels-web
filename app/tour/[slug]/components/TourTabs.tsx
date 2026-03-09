import { navigationItems } from "./tourData";

export default function TourTabs() {
  return (
    <div className="mt-6 border-b border-[#e5e7eb]">
      <nav className="flex flex-wrap gap-6 text-[15px] font-semibold text-[#133728]">
        {navigationItems.map((item, index) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className={`pb-3 ${
              index === 0
                ? "border-b-2 border-[#123d2f]"
                : "border-b-2 border-transparent"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
}

import { navigationItems } from "./tourData";

export default function TourTabs() {
  return (
    <div className="mt-6 overflow-x-auto border-b border-[#e5e7eb] [scrollbar-width:none] [-ms-overflow-style:none]">
      <nav className="flex min-w-max items-center gap-5 whitespace-nowrap text-[14px] font-semibold text-[#133728] sm:gap-6 sm:text-[15px]">
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

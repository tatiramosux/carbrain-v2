import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faXTwitter, faYoutube, faInstagram } from "@fortawesome/free-brands-svg-icons";

const footerColumns = [
  {
    title: "CarBrain",
    items: [],
    address: "7920 NW 154th Street, Suite #401\nMiami Lakes, FL 33016",
    social: true,
  },
  {
    title: "Company",
    items: [
      "About Us",
      "How It Works",
      "Recent Purchases",
      "Area Served",
      "Careers",
      "Press",
      "Blog",
      "Contact Us",
      "Affiliates",
      "Reviews",
      "Sitemap",
    ],
  },
  {
    title: "Resources",
    items: [
      "FAQs",
      "Car Value Guide",
      "Sell Junk Car",
      "Cash for Cars",
      "Sell Damaged Car",
      "Sell Wrecked Car",
      "Sell Old Car",
      "Sell Non-Running Car",
      "How to Sell a Car",
      "Car Removal",
      "Sell Car Fast",
    ],
  },
  {
    title: "Legal",
    items: [
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
      "Accessibility",
      "CCPA Notice",
      "Do Not Sell My Info",
      "Disclaimer",
      "Licenses",
      "Complaints",
      "Data Request",
      "Security",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#001530] border-t border-white/10 font-nunito">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerColumns.map((col) => (
            <div key={col.title}>
              {col.title === "CarBrain" ? (
                <div className="mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/carbrain-logo.svg"
                    alt="CarBrain"
                    className="h-7 w-auto"
                  />
                </div>
              ) : (
                <h3 className="font-bold text-white text-base mb-4">
                  {col.title}
                </h3>
              )}
              {"address" in col && (
                <p className="text-sm text-white/60 mb-4 whitespace-pre-line">{col.address}</p>
              )}
              {"social" in col && (
                <div className="flex items-center gap-3 mb-4">
                  {[faFacebook, faXTwitter, faYoutube, faInstagram].map((icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <FontAwesomeIcon icon={icon} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            CarBrain.com, Copyright © 2026. All rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

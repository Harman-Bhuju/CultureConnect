import React from "react";
import "./Footer.css";
import Facebook from "../../assets/brands-logo/facebook.svg";
import Instagram from "../../assets/brands-logo/instagram.svg";
import Twitter from "../../assets/brands-logo/twitter.svg";
import Github from "../../assets/brands-logo/github.svg";
import CultureConnectLogo from "../../assets/logo/cultureconnect__fav.png";
import { Link, NavLink } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const socialLinks = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
  {
    icon: Github,
    href: "https://github.com/Harman-Bhuju/CultureConnect",
    label: "Github",
  },
];

export default function Footer() {
  const { user } = useAuth();

  const partnershipLinks = [];
  if (user) {
    if (user.role === "admin") {
      partnershipLinks.push({ name: "Admin Panel", href: "/admin" });
    } else if (user.role === "delivery") {
      partnershipLinks.push({
        name: "Delivery Dashboard",
        href: "/delivery",
      });
    } else {
      // Dynamic links for users, sellers, and experts
      if (user.seller_id) {
        partnershipLinks.push({
          name: "Seller Profile",
          href: `/sellerprofile/${user.seller_id}`,
        });
        partnershipLinks.push({
          name: "Seller Dashboard",
          href: `/seller/manageproducts/${user.seller_id}`,
        });
      } else {
        partnershipLinks.push({
          name: "Become a Seller",
          href: "/seller-registration",
        });
      }

      if (user.teacher_id) {
        partnershipLinks.push({
          name: "Expert Profile",
          href: `/teacherprofile/${user.teacher_id}`,
        });
        partnershipLinks.push({
          name: "Expert Dashboard",
          href: `/teacher/manageclasses/${user.teacher_id}`,
        });
      } else {
        partnershipLinks.push({
          name: "Become an Expert",
          href: "/teacher-registration",
        });
      }
    }
  } else {
    // Guest view
    partnershipLinks.push({
      name: "Become a Seller",
      href: "/seller-registration",
    });
    partnershipLinks.push({
      name: "Become an Expert",
      href: "/teacher-registration",
    });
  }

  const footerCategories = [
    {
      title: "Explore",
      links: [
        { name: "Home", href: "/" },
        { name: "Marketplace", href: "/marketplace" },
        { name: "Traditional Arts", href: "/marketplace/arts_decors" },
        { name: "Musical Instruments", href: "/marketplace/instruments" },
        { name: "Culture Learning", href: "/learnculture" },
      ],
    },
    {
      title: "Partnership",
      links: partnershipLinks,
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/documentation" },
        {
          name: "Contact Us",
          href: "https://mail.google.com/mail/?view=cm&fs=1&to=cultureconnect0701@gmail.com",
          external: true,
        },
        { name: "Developer Team", href: "/documentation/team" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/documentation/privacy" },
        { name: "Terms of Service", href: "/documentation/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0f1115] text-white pt-10 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Brand Section - More compact on mobile */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10 md:hidden">
          <Link to="/" className="flex items-center gap-3 group mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/10 transition-all duration-300 group-hover:shadow-red-600/20">
              <img
                src={CultureConnectLogo}
                alt="CultureConnect"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold tracking-tight text-white">
                CultureConnect
              </span>
              <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-[0.15em]">
                Heritage Platform
              </span>
            </div>
          </Link>
          <p className="text-gray-400 text-xs leading-relaxed max-w-[280px] mb-4">
            Connecting you with tradition. Discover authentic artifacts & learn
            cultural arts.
          </p>
          <div className="flex gap-2.5">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-300 group"
                title={social.label}>
                <img
                  src={social.icon}
                  alt={social.label}
                  className="w-4 h-4 brightness-0 invert group-hover:scale-110 transition-transform opacity-70 group-hover:opacity-100"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Links Grid - 2 columns on mobile, 4 on tablet, full on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-8 mb-8 sm:mb-16">
          {/* Brand Section - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex lg:col-span-2 space-y-6 flex-col items-start text-left">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/10 transition-all duration-300 group-hover:shadow-red-600/20">
                <img
                  src={CultureConnectLogo}
                  alt="CultureConnect"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold tracking-tight text-white block">
                  CultureConnect
                </span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-[0.2em]">
                  Heritage Platform
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Connecting you with the soul of tradition. Discover authentic
              artifacts, learn cultural arts from masters, and celebrate our
              shared heritage.
            </p>

            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 hover:border-red-600 text-gray-400 hover:text-white transition-all duration-300 group"
                  title={social.label}>
                  <img
                    src={social.icon}
                    alt={social.label}
                    className="w-5 h-5 brightness-0 invert group-hover:scale-110 transition-transform opacity-70 group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links Categories */}
          {footerCategories.map((category, idx) => (
            <div
              key={idx}
              className="space-y-3 sm:space-y-4 flex flex-col items-start text-left">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white/50">
                {category.title}
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 w-full">
                {category.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-red-500 text-[13px] sm:text-sm transition-colors flex items-center gap-1.5 group">
                        <span className="w-1 h-1 rounded-full bg-red-600/30 group-hover:bg-red-600 transition-all duration-300"></span>
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-red-500 text-[13px] sm:text-sm transition-colors flex items-center gap-1.5 group">
                        <span className="w-1 h-1 rounded-full bg-red-600/30 group-hover:bg-red-600 transition-all duration-300"></span>
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6">
          <div className="text-gray-500 text-[10px] sm:text-xs font-medium text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-400">CultureConnect</span>. All rights
            reserved.
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 text-[10px] sm:text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
            <span>By</span>
            <Link
              to={"/documentation/team"}
              className="text-gray-400 hover:text-white transition-colors">
              Harman & Harshit
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

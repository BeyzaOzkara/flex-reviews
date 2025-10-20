import Image from "next/image";
import { Mail, Info, BookOpen, Building2, ChevronDown } from "lucide-react";

export default function FlexHeader() {
  return (
    <header className="bg-[#2D5551] text-white h-[88px] w-full flex items-center">
      <div className="relative flex w-full items-center justify-between px-10">
        {/* --- Logo (fixed left) --- */}
        <div className="absolute left-10 flex items-center gap-3">
          <Image
            src="/logo-flex.png" // put logo under /public/
            alt="The Flex Logo"
            width={150}
            height={150}
          />
        </div>

        {/* --- Navigation (right side) --- */}
        <nav className="ml-auto flex items-center gap-8 text-sm font-medium">
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
            <Building2 className="w-4 h-4" />
            <span>Landlords</span>
            <ChevronDown className="w-4 h-4 opacity-80" />
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200">
            <Info className="w-4 h-4" />
            <span>About Us</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200">
            <BookOpen className="w-4 h-4" />
            <span>Careers</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200">
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </div>
          <span className="text-xs font-semibold">GB</span>
          <span className="text-sm">English</span>
          <span className="font-semibold text-sm">£ GBP</span>
        </nav>
      </div>
    </header>
  );
}

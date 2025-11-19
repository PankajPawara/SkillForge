import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-4 mt-10">
      <div className="mx-auto justify-center ">
        <h1 className="text-bold text-center"><b>&copy; {new Date().getFullYear()} SkillForge. No rights reserved.</b></h1>
      </div>
    </footer>
  );
};

export default Footer;

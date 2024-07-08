import React from "react";
import { Chip } from "@nextui-org/react";
import { CodeXml } from "lucide-react";

const Footer = () => {
  return (
    <div className="flex justify-center items-center">
      <Chip
        startContent={<CodeXml size={16} />}
        color="primary"
        size="md"
        variant="bordered"
        className="text-center mt-2  mx-auto"
      >
        Markyyyyyy_GG
      </Chip>
    </div>
  );
};

export default Footer;

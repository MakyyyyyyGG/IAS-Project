import React from "react";
import { Chip } from "@nextui-org/react";
import { CodeXml } from "lucide-react";

const Footer = () => {
  return (
    <div>
      <Chip
        startContent={<CodeXml size={16} />}
        color="primary"
        size="md"
        variant="flat"
        className="text-center absolute bottom-0 left-0 right-0 mb-2 mx-auto"
      >
        Markyyyyyy_GG
      </Chip>
    </div>
  );
};

export default Footer;

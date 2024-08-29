import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

interface BankOption {
  id: string;
  name: string;
  isNew: boolean;
  logoPath: string;
}

const bankOptions: BankOption[] = [
  {
    id: "bca",
    name: "BCA Virtual Account",
    isNew: true,
    logoPath: "/bankLogo/bcaLogo.png",
  },
  {
    id: "bri",
    name: "BRI Virtual Account",
    isNew: true,
    logoPath: "/bankLogo/briLogo2.jpeg",
  },
  {
    id: "bni",
    name: "BNI Virtual Account",
    isNew: true,
    logoPath: "/bankLogo/bniLogo2.jpeg",
  },
];

const BankOptionsCard: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<string>("bca");

  const handleBankSelection = (value: string) => {
    setSelectedBank(value);
  };
  console.log("ini statenya", selectedBank);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-greenr text-white p-4">
        <CardTitle className="text-lg font-medium">
          We're holding this price for you! Let's complete your payment in
          00:29:33
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">How would you like to pay?</h2>
          <div className="flex items-start text-xs text-gray-600">
            <Shield className="w-4 h-4 mr-1" />
            100% SECURITY GUARANTEE
          </div>
        </div>
        <RadioGroup value={selectedBank} onValueChange={handleBankSelection}>
          <div className="space-y-4">
            <div className="font-semibold mb-2">Virtual Account</div>
            {bankOptions.map((bank, index) => (
              <div
                key={bank.id}
                className={`${
                  selectedBank === bank.id
                    ? "bg-white text-greenr border border-greenr"
                    : ""
                } rounded-md p-3 transition-colors duration-200`}>
                <RadioGroupItem
                  value={bank.id}
                  id={bank.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={bank.id}
                  className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 border rounded-full mr-3 ${
                        selectedBank === bank.id
                          ? "border-greenr bg-greenr"
                          : "border-gray-300"
                      }`}></div>
                    {bank.name}
                  </div>
                  <img src={bank.logoPath} alt={bank.name} className="h-6" />
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default BankOptionsCard;

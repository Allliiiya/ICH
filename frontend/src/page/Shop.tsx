import React, { type JSX } from "react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { Separator } from "../components/separator";

const Shop = (): JSX.Element => {
  // Store data for mapping
  const stores = [
    {
      id: 1,
      name: "Store Name 1",
      category: "Category",
      description: "Store description:",
      address: "Address: 123 NY",
      hours: "Hours of operation:",
      imageUrl: "https://c.animaapp.com/mdvllevhnjoyUy/img/image.svg",
    },
    {
      id: 2,
      name: "Store Name 1",
      category: "Category",
      description: "Store description:",
      address: "Address: 123 NY",
      hours: "Hours of operation:",
      imageUrl: "https://c.animaapp.com/mdvllevhnjoyUy/img/image.svg",
    },
    {
      id: 3,
      name: "Store Name 1",
      category: "Category",
      description: "Store description:",
      address: "Address: 123 NY",
      hours: "Hours of operation:",
      imageUrl: "https://c.animaapp.com/mdvllevhnjoyUy/img/image.svg",
    },
    {
      id: 4,
      name: "Store Name 1",
      category: "Category",
      description: "Store description:",
      address: "Address: 123 NY",
      hours: "Hours of operation:",
      imageUrl: "https://c.animaapp.com/mdvllevhnjoyUy/img/image.svg",
    },
    {
      id: 5,
      name: "Store Name 1",
      category: "Category",
      description: "Store description:",
      address: "Address: 123 NY",
      hours: "Hours of operation:",
      imageUrl: "https://c.animaapp.com/mdvllevhnjoyUy/img/image.svg",
    },
    {
      id: 6,
      name: "Store Name 1",
      category: "Category",
      description: "Store description:",
      address: "Address: 123 NY",
      hours: "Hours of operation:",
      imageUrl: "https://c.animaapp.com/mdvllevhnjoyUy/img/image.svg",
    },
  ];


  return (
    <div
      className="bg-white flex flex-row justify-center w-full"
      data-model-id="1:1782"
    >
      <div className="bg-white overflow-hidden w-full max-w-[1442px] relative">
        {/* Hero section */}
        <header className="relative w-full h-[720px]">
          <div className="absolute w-full h-full [background:url(https://c.animaapp.com/mdvllevhnjoyUy/img/header-with-image.png)_50%_50%_/_cover,linear-gradient(0deg,rgba(247,247,247,1)_0%,rgba(247,247,247,1)_100%)]">
            <div className="h-full w-full bg-[#0000003d]" />
          </div>
        </header>

        {/* Store listings */}
        <main className="mt-[142px] px-20">
          {stores.map((store, index) => (
            <div
              key={store.id}
              className={`flex flex-row gap-16 mb-16 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              <div
                className="w-[624px] h-[400px] rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${store.imageUrl})` }}
              />

              <Card className="flex flex-col w-[515px] items-start justify-center gap-6 border-none shadow-none">
                <CardContent className="p-0 flex flex-col gap-6 w-full">
                  <h2 className="font-semibold text-[40px] leading-[48px] text-black font-['Inter',Helvetica]">
                    {store.name}
                  </h2>

                  <p className="font-subheading font-[number:var(--subheading-font-weight)] text-[#828282] text-[length:var(--subheading-font-size)] tracking-[var(--subheading-letter-spacing)] leading-[var(--subheading-line-height)]">
                    {store.category}
                  </p>

                  <p className="font-normal text-xl text-[#828282] leading-[30px] font-['Inter',Helvetica]">
                    {store.description}
                  </p>

                  <Button className="w-full bg-black text-white rounded-lg shadow-button-shadow py-3.5 h-auto">
                    <span className="font-small-text font-[number:var(--small-text-font-weight)] text-[length:var(--small-text-font-size)] tracking-[var(--small-text-letter-spacing)] leading-[var(--small-text-line-height)]">
                      Visit Website
                    </span>
                  </Button>

                  <p className="font-small-text font-[number:var(--small-text-font-weight)] text-[#828282] text-[length:var(--small-text-font-size)] tracking-[var(--small-text-letter-spacing)] leading-[var(--small-text-line-height)]">
                    {store.address}
                  </p>

                  <p className="font-small-text font-[number:var(--small-text-font-weight)] text-[#828282] text-[length:var(--small-text-font-size)] tracking-[var(--small-text-letter-spacing)] leading-[var(--small-text-line-height)]">
                    {store.hours}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </main>

        {/* Footer */}
        <footer className="h-[264px] w-full bg-white relative mt-16">
          <Separator className="w-[1280px] mx-auto" />
          <div className="h-9 top-[51px] left-20 font-subheading font-[number:var(--subheading-font-weight)] text-black text-[length:var(--subheading-font-size)] leading-[var(--subheading-line-height)] absolute tracking-[var(--subheading-letter-spacing)]">
            Heritage
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Shop;

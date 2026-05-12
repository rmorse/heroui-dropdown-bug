import type { Selection } from "@heroui/react";
import { Button, Dropdown, Header, Label } from "@heroui/react";
import { useState } from "react";

import "./App.css";

const FRUITS = [
  "Apple",
  "Banana",
  "Cherry",
  "Orange",
  "Pear",
  "Mango",
  "Plum",
  "Grape",
  "Peach",
  "Kiwi",
];

function ReproDropdown() {
  const [selected, setSelected] = useState<Selection>(new Set(["apple"]));

  return (
    <Dropdown>
      <Button aria-label="Open fruit menu" variant="secondary">
        Fruit
      </Button>
      <Dropdown.Popover className="min-w-[256px]">
        <Dropdown.Menu
          selectedKeys={selected}
          selectionMode="single"
          onSelectionChange={setSelected}
        >
          <Dropdown.Section>
            <Header>Select a fruit</Header>
            {FRUITS.slice(0, 3).map((fruit) => (
              <Dropdown.Item
                id={fruit.toLowerCase()}
                key={fruit}
                textValue={fruit}
              >
                <Dropdown.ItemIndicator />
                <Label>{fruit}</Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Section>
          {FRUITS.slice(3).map((fruit) => (
            <Dropdown.Item id={fruit.toLowerCase()} key={fruit} textValue={fruit}>
              <Dropdown.ItemIndicator />
              <Label>{fruit}</Label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default function App() {
  return (
    <main className="probe-page">
      <div className="probe-spacer" aria-hidden="true" />
      <div className="probe-target">
        <ReproDropdown />
      </div>
    </main>
  );
}

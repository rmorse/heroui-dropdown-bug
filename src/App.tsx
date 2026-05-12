import { Button, Dropdown, Label } from '@heroui/react'
import './App.css'

const ITEMS = Array.from({ length: 10 }, (_, index) => ({
  id: `item-${index + 1}`,
  label: `Dropdown item ${index + 1}`,
}))

function DemoDropdown({
  label,
  popoverClassName,
}: {
  label: string
  popoverClassName?: string
}) {
  return (
    <Dropdown>
      <Button aria-label={label} variant="secondary">
        {label}
      </Button>
      <Dropdown.Popover className={popoverClassName}>
        <Dropdown.Menu
          aria-label={`${label} items`}
          onAction={(key) => console.log(`Selected: ${key}`)}
        >
          {ITEMS.map((item) => (
            <Dropdown.Item key={item.id} id={item.id} textValue={item.label}>
              <Label>{item.label}</Label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

export default function App() {
  return (
    <main className="repro-page">
      <header className="intro">
        <h1>HeroUI Dropdown placement transition repro</h1>
        <p>
          Scroll until the buttons sit near the bottom of the viewport. Opening
          the default dropdown can initially render it below the trigger with a
          tiny max-height, then reposition/grow. The patched dropdown only adds
          <code>transition-property: transform, opacity</code> to the popover.
        </p>
      </header>

      <div className="synthetic-spacer" aria-hidden="true" />

      <section className="repro-target" aria-label="Dropdown repro targets">
        <div>
          <h2>Default HeroUI dropdown</h2>
          <DemoDropdown label="Default dropdown" />
        </div>

        <div>
          <h2>Same dropdown with transition-property fix</h2>
          <DemoDropdown
            label="Patched dropdown"
            popoverClassName="patched-dropdown-popover"
          />
        </div>
      </section>

      <div className="trailing-space" aria-hidden="true" />
    </main>
  )
}

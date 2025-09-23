"use client"

import { useState, useEffect } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

const predefinedColors = [
  { name: "Merah", red: 204, green: 51, blue: 51 },
  { name: "Biru", red: 51, green: 51, blue: 204 },
  { name: "Hijau", red: 51, green: 153, blue: 51 },
  { name: "Ungu", red: 153, green: 51, blue: 204 },
  { name: "Orange", red: 255, green: 140, blue: 51 },
  { name: "Pink", red: 255, green: 102, blue: 178 },
  { name: "Kuning", red: 255, green: 255, blue: 51 },
  { name: "Cyan", red: 51, green: 204, blue: 204 },
  { name: "Abu-abu", red: 102, green: 102, blue: 102 },
]

export function ColorPicker() {
  const [red, setRed] = useState(0)
  const [green, setGreen] = useState(0)
  const [blue, setBlue] = useState(102)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load saved color from localStorage
    const savedColor = localStorage.getItem("custom-color")
    if (savedColor) {
      const { r, g, b } = JSON.parse(savedColor)
      setRed(r)
      setGreen(g)
      setBlue(b)
      applyCustomColor(r, g, b)
    }
  }, [])

  const applyCustomColor = (r: number, g: number, b: number) => {
    document.documentElement.style.setProperty("--custom-primary-red", r.toString())
    document.documentElement.style.setProperty("--custom-primary-green", g.toString())
    document.documentElement.style.setProperty("--custom-primary-blue", b.toString())
    document.documentElement.classList.add("custom-theme")

    // Save to localStorage
    localStorage.setItem("custom-color", JSON.stringify({ r, g, b }))
  }

  const resetToDefault = () => {
    setRed(0)
    setGreen(0)
    setBlue(102)
    document.documentElement.classList.remove("custom-theme")
    localStorage.removeItem("custom-color")
  }

  const selectPredefinedColor = (color: (typeof predefinedColors)[0]) => {
    setRed(color.red)
    setGreen(color.green)
    setBlue(color.blue)
    applyCustomColor(color.red, color.green, color.blue)
  }

  const handleCustomColorChange = () => {
    applyCustomColor(red, green, blue)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Pilih Warna</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pilih Warna Tema</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Predefined Colors */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Warna Populer</Label>
            <div className="grid grid-cols-3 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => selectPredefinedColor(color)}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full mb-1"
                    style={{
                      backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`,
                    }}
                  />
                  <span className="text-xs">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Sliders */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Warna Kustom</Label>

            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Red (Merah): {red}</Label>
                <Slider
                  value={[red]}
                  onValueChange={(value) => setRed(value[0])}
                  onValueCommit={handleCustomColorChange}
                  max={255}
                  step={1}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Green (Hijau): {green}</Label>
                <Slider
                  value={[green]}
                  onValueChange={(value) => setGreen(value[0])}
                  onValueCommit={handleCustomColorChange}
                  max={255}
                  step={1}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Blue (Biru): {blue}</Label>
                <Slider
                  value={[blue]}
                  onValueChange={(value) => setBlue(value[0])}
                  onValueCommit={handleCustomColorChange}
                  max={255}
                  step={1}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Color Preview */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border"
                style={{
                  backgroundColor: `rgb(${red}, ${green}, ${blue})`,
                }}
              />
              <div className="text-sm">
                <div className="font-medium">Preview Warna</div>
                <div className="text-muted-foreground text-xs">
                  rgb({red}, {green}, {blue})
                </div>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <Button onClick={resetToDefault} variant="outline" className="w-full bg-transparent">
            Reset ke Default
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import AppKit
import Foundation

let size = 1024
let image = NSImage(size: NSSize(width: size, height: size))
image.lockFocus()
let rect = NSRect(x: 0, y: 0, width: size, height: size)
let path = NSBezierPath(roundedRect: rect, xRadius: 220, yRadius: 220)
let gradient = NSGradient(colors: [
    NSColor(calibratedRed: 0.12, green: 0.42, blue: 0.88, alpha: 1),
    NSColor(calibratedRed: 0.25, green: 0.72, blue: 0.92, alpha: 1)
])!
gradient.draw(in: path, angle: -35)
if let symbol = NSImage(systemSymbolName: "eye.fill", accessibilityDescription: "TachiKids")?
    .withSymbolConfiguration(NSImage.SymbolConfiguration(pointSize: 620, weight: .medium)) {
    symbol.isTemplate = true
    NSColor.white.set()
    symbol.draw(in: NSRect(x: 150, y: 240, width: 724, height: 500))
}
image.unlockFocus()
let data = image.tiffRepresentation!
let bitmap = NSBitmapImageRep(data: data)!
let png = bitmap.representation(using: .png, properties: [:])!
try png.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))

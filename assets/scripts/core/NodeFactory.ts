import {
  Color,
  Graphics,
  HorizontalTextAlignment,
  Label,
  Layers,
  Node,
  Size,
  UITransform,
  VerticalTextAlignment,
} from 'cc';

export function hexColor(hex: string): Color {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return new Color(r, g, b, 255);
}

export function createUiNode(name: string, width: number, height: number): Node {
  const node = new Node(name);
  node.layer = Layers.Enum.UI_2D;
  const transform = node.addComponent(UITransform);
  transform.setContentSize(new Size(width, height));
  return node;
}

export function drawRect(node: Node, width: number, height: number, fill: string, stroke?: string, radius = 10): Graphics {
  const graphics = node.addComponent(Graphics);
  graphics.clear();
  graphics.fillColor = hexColor(fill);
  graphics.roundRect(-width / 2, -height / 2, width, height, radius);
  graphics.fill();

  if (stroke) {
    graphics.strokeColor = hexColor(stroke);
    graphics.lineWidth = 2;
    graphics.roundRect(-width / 2, -height / 2, width, height, radius);
    graphics.stroke();
  }

  return graphics;
}

export function drawCircle(node: Node, radius: number, fill: string, stroke?: string): Graphics {
  const graphics = node.addComponent(Graphics);
  graphics.clear();
  graphics.fillColor = hexColor(fill);
  graphics.circle(0, 0, radius);
  graphics.fill();

  if (stroke) {
    graphics.strokeColor = hexColor(stroke);
    graphics.lineWidth = 2;
    graphics.circle(0, 0, radius);
    graphics.stroke();
  }

  return graphics;
}

export function addCenteredLabel(node: Node, text: string, fontSize: number, color = '#ffffff'): Label {
  const label = node.addComponent(Label);
  label.string = text;
  label.fontSize = fontSize;
  label.lineHeight = fontSize + 4;
  label.color = hexColor(color);
  label.horizontalAlign = HorizontalTextAlignment.CENTER;
  label.verticalAlign = VerticalTextAlignment.CENTER;
  return label;
}

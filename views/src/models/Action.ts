export class Action {
  icon: React.ReactNode;
  name!: string;
  onClick!: () => void;
  constructor(name: string, icon: React.ReactNode, onClick: () => void) {
    this.name = name;
    this.icon = icon;
    this.onClick = onClick;
  }
}

export class Service {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string; // Единица измерения
  groupName: string; // Группа услуг

  constructor(id: number, name: string, description: string, price: number, unit: string, groupName: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.unit = unit;
    this.groupName = groupName;
  }
}

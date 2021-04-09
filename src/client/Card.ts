import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { CardJson, CardSuit, CardValue, CardValueUtil } from "../common/Card";

class Card extends PIXI.Sprite {
  private static readonly WIDTH = 140;
  private static readonly HEIGHT = 190;
  private static readonly SELECTED_OFFSET_Y = 20;

  private value: CardValue;
  private suit: CardSuit;

  private selected: boolean;

  constructor(value: CardValue, suit: CardSuit) {
    super();
    this.value = value;
    this.suit = suit;
    this.selected = false;
    this.setCenterAsOrigin();
    this.enableInteraction();
    this.addEventListeners();
    this.draw();
  }

  public static comparator(a: Card, b: Card): number {
    const aCardValueNumber = CardValueUtil.toNumber(a.value);
    const bCardValueNumber = CardValueUtil.toNumber(b.value);
    if (aCardValueNumber > bCardValueNumber) return 1;
    if (aCardValueNumber < bCardValueNumber) return -1;
    return a.suit.toString().localeCompare(b.suit.toString());
  }

  public greaterThan(other: Card): boolean {
    const cardValueNumber = CardValueUtil.toNumber(this.value);
    const otherCardValueNumber = CardValueUtil.toNumber(other.value);
    return cardValueNumber > otherCardValueNumber;
  }

  private setCenterAsOrigin() {
    this.anchor.set(0.5);
  }

  private defineHitArea(): void {
    this.hitArea = new PIXI.Rectangle(
      -Card.WIDTH / 2,
      -Card.HEIGHT / 2,
      Card.WIDTH,
      Card.HEIGHT
    );
  }

  private enableInteraction(): void {
    this.defineHitArea();
    this.interactive = true;
  }

  private addEventListeners(): void {
    this.on("pointerdown", this.handlePointerDown);
  }

  private handlePointerDown = () => {
    this.y += Card.SELECTED_OFFSET_Y * (this.selected ? 1 : -1);
    this.selected = !this.selected;
    sound.play("cardSlide1.ogg");
  };

  public deselect() {
    if (this.selected) {
      this.y += Card.SELECTED_OFFSET_Y;
      this.selected = false;
    }
  }

  private draw() {
    const loader = PIXI.Loader.shared;
    this.texture =
      loader.resources[`card${this.suit}${this.value}.png`].texture;
  }

  public static fromJson(json: CardJson) {
    return new Card(json.value, json.suit);
  }

  public isSelected() {
    return this.selected;
  }

  public toJson(): CardJson {
    return {
      value: this.value,
      suit: this.suit,
    };
  }

  public getValue() {
    return this.value;
  }

  public getSuit() {
    return this.suit;
  }
}

export default Card;

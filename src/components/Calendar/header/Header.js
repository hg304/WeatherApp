// import modular CSS:
import style from "./style";
import { h, Component } from 'preact';
//displays header of schedule
export default function Header() {
  return (
    <header class={style.header}>
      <h2>Your Schedule</h2>
    </header>
  );
}
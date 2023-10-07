import { LitElement, PropertyValueMap, css, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { TeamMember } from '../models/TeamMember';
import { trovaSottolistaProssimaSomma } from '../utils';

@customElement('my-core')
export class MyCore extends LitElement {

  static styles = css`
    .container {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }

    .add-form {
      width: 100%;
      display: grid;
      grid-template-columns: auto minmax(10px, 1fr);
      grid-gap: 4px 12px;
      margin: 10px 0;
    }

    .add-form .full-row {
      grid-column-start: 1;
      grid-column-end: 3;
      display: inline-grid;
    }

    .member {
      width: 100%;
      display: grid;
      grid-template-columns: auto minmax(10px, 1fr) 30px;
      grid-gap: 4px 12px;
      margin: 10px 0;
    }

    .member.non-deletable {
      grid-template-columns: auto minmax(10px, 1fr);
    }

    .bold {
      font-weight: 600;
    }

    .clickable {
      cursor: pointer;
    }
  `;

  @query('form#add-form')
  $form: HTMLFormElement;

  @query('form#calculate-form')
  $calcForm: HTMLFormElement;

  @state()
  private team1: TeamMember[] = [];

  @state()
  private solution: TeamMember[] = [];

  render() {
    return html`
    <div class="container">
      <p>Benvenuto al'organizzatore per il tiro alla fune!</p>
      <div>
        <p>Aggiungi un giocatore:</p>
        <form class="add-form" id="add-form">
          <input type="text" name="name" placeholder="Inserisci il nome">
          <input type="number" name="weight" placeholder="Inserisci il peso">
          <button type="submit" @click=${this.addMember} class="full-row">Aggiungi</button>
        </form>
      </div>
      <div class="member">${this.team1.length > 0 ? this.buildTeamMemberTable(this.team1, true) : html`<i>Aggiungi qualcuno</i>`}</div>

      <div>
        <p>Indica quanti elementi vuoi nel sottogruppo e a quale peso totale devono avvicinarsi:</p>
        <form class="add-form" id="calculate-form">
          <input type="number" name="componentsCount" placeholder="Inserisci il numero di componenti">
          <input type="number" name="targetWeight" placeholder="Inserisci il peso totale da raggiungere">
          <button type="submit" @click=${this.calculate} class="full-row">Calcola</button>
        </form>
      </div>
      <div class="member non-deletable">${this.solution.length > 0 ? this.buildTeamMemberTable(this.solution, false) : html`<i>Calcola</i>`}</div>
    </div>
    `;
  }

  private buildTeamMemberTable(memberList: TeamMember[], deletable: boolean) {
    let team1Joined = html``;
    memberList
      .map(member => html`<div class="member-row bold">${member.name}</div>
      <div class="member-row">${member.weight} Kg</div>
      ${deletable ? html`<div class="member-row">
        <span class="clickable" @click=${() => { this.removeMember(member.name); }}>X</span>
      </div>` : null}
      `)
      .forEach(slice => team1Joined = html`${team1Joined}${slice}`);
    return team1Joined;
  }

  protected firstUpdated(): void {
    const memberListString = localStorage.getItem("memberList");
    if (!!memberListString && memberListString.length > 0) {
      const parsedMembers: TeamMember[] = JSON.parse(memberListString);
      if (!!parsedMembers && parsedMembers.length > 0)
        this.team1 = parsedMembers;
    }
  }

  private removeMember(memberName: string): void {
    this.team1 = this.team1.filter(member => member.name !== memberName);
    localStorage.setItem("memberList", JSON.stringify(this.team1));
  }

  private addMember(event: Event) {
    console.log("Adding...");
    event.preventDefault();
    const newMemberName: Element | RadioNodeList = this.$form.elements.namedItem("name");
    const newMemberWeight: Element | RadioNodeList = this.$form.elements.namedItem("weight");

    if ("value" in newMemberName
      && !this.team1.find((element) => element.name === newMemberName.value)
      && "value" in newMemberWeight
      && newMemberName.value.length > 0) {
      this.team1 = [...this.team1, { name: newMemberName.value, weight: +newMemberWeight.value }];

      localStorage.setItem("memberList", JSON.stringify(this.team1));
    }
  }

  private calculate(event: Event) {
    event.preventDefault();
    const componentsCount = this.$calcForm.elements.namedItem("componentsCount");
    const targetWeight = this.$calcForm.elements.namedItem("targetWeight");
    if ("value" in componentsCount
      && "value" in targetWeight) {
      const m: number = +componentsCount.value;
      const y: number = +targetWeight.value;

      this.solution = trovaSottolistaProssimaSomma(this.team1, m, y);
    }
  }

}
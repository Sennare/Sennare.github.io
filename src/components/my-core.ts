import { LitElement, PropertyValueMap, css, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

interface TeamMember {
  name: string;
  weight: number;
}

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

  @query('form')
  $form: HTMLFormElement;

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
        <form class="add-form">
          <input type="text" name="name" placeholder="Inserisci il nome">
          <input type="number" name="weight" placeholder="Inserisci il peso">
          <button type="submit" @click=${this.addMember} class="full-row">Aggiungi</button>
        </form>
      </div>
      <div class="member">${this.team1.length > 0 ? this.buildTeamMemberTable(this.team1, true) : html`<i>Aggiungi qualcuno</i>`}</div>

      <button type="submit" style="width:100%" @click=${this.calculate}>Calcola</button>
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

  private calculate() {
    const m: number = 3;
    const y: number = 45;

    this.solution = this.trovaSottolistaProssimaSomma(this.team1, m, y);
  }

  private trovaSottolistaProssimaSomma(lista: TeamMember[], m: number, y: number): TeamMember[] {
    let miglioreSomma = 0;
    let miglioreSottolista: TeamMember[] = [];

    function combinazioni(arr: TeamMember[], n: number, callback: (combo: TeamMember[]) => void, combo: TeamMember[] = [], startIndex: number = 0): void {
      if (combo.length === n) {
        callback(combo);
        return;
      }

      for (let i = startIndex; i < arr.length; i++) {
        combo.push(arr[i]);
        combinazioni(arr, n, callback, combo, i + 1);
        combo.pop();
      }
    }

    combinazioni(lista, m, (combinazione) => {
      const sommaCombinazione = combinazione.reduce((acc, val) => acc + val.weight, 0);
      if (Math.abs(sommaCombinazione - y) < Math.abs(miglioreSomma - y)) {
        miglioreSomma = sommaCombinazione;
        miglioreSottolista = [...combinazione];
      }
    });

    return miglioreSottolista;
  }

}
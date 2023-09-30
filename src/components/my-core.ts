import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';


@customElement('my-core')
export class MyCore extends LitElement {

  @query('#add-member-team1')
  input!: HTMLInputElement;

  @state()
  private team1: string[] = [];

  @state()
  private team2: string[] = [];

  render() {
    const team1Joined = this.team1.join(", ");
    console.log("render with list" + team1Joined);
    return html`
    <p>Benvenuto al'organizzatore per il tiro alla fune!</p>
    <p>Aggiungi un giocatore:</p>
    <input type="text" class="form-control" id="add-member-team1"> <br />
    <button type="submit" class="btn btn-primary" @click=${this.addPlayer}>Aggiungi</button> <br />
    <p>${team1Joined}<p/>

    <button type="submit" class="btn btn-primary" @click=${this.calculate}>Calcola</button>
    `;
  }

  addPlayer() {
    const newMember = this.input.value;
    if (!this.team1.find((element) => element === newMember)) {
      this.team1 = [...this.team1,newMember];
      console.log("Called with member: " + newMember);
    }
  }

  calculate() {
    const listaNumeri: number[] = [1, 2, 3, 4, 5];
    const m: number = 3;
    const y: number = 9;

    const risultato: number[] = this.trovaSottolistaProssimaSomma(listaNumeri, m, y);
    console.log("Sottolista con somma più vicina a", y + ":", risultato);
  }

  private trovaSottolistaProssimaSomma(lista: number[], m: number, y: number): number[] {
    let miglioreSomma = 0;
    let miglioreSottolista: number[] = [];

    function combinazioni(arr: number[], n: number, callback: (combo: number[]) => void, combo: number[] = [], startIndex: number = 0): void {
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
      const sommaCombinazione = combinazione.reduce((acc, val) => acc + val, 0);
      if (Math.abs(sommaCombinazione - y) < Math.abs(miglioreSomma - y)) {
        miglioreSomma = sommaCombinazione;
        miglioreSottolista = [...combinazione];
      }
    });

    return miglioreSottolista;
  }

}
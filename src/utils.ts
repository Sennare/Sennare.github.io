import { TeamMember } from "./models/TeamMember";

export function trovaSottolistaProssimaSomma(lista: TeamMember[], m: number, y: number): TeamMember[] {
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
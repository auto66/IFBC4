const populateTable = (tableName, tableData) => {
  const table = document.getElementById(tableName);
  const tableHead = ['Rank', 'Team', 'Count', 'Wins', 'Shootouts', 'Rounds', 'HP-Loss'];

  table.innerHTML = `
    <thead>
      <tr>
        ${tableHead.map(head => `<th>${head}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${tableData ? tableData.map(rowData => `
        <tr>
          ${rowData.map(cellData => `<td>${cellData}</td>`).join('')}
        </tr>
      `).join('') : ''}
    </tbody>
  `;
};

const sortTable = (data) => {
  if(!data) return [];

  const resp = {};
  data.forEach(entry => {
    const [teamA, teamB, winner, shootdown, rounds, loss] = entry;

    [teamA, teamB].forEach(team => {
      if(!resp[team]) resp[team] = {
        name: team,
        battles: 0,
        wins: 0,
        shootdowns: 0,
        rounds: 0,
        loss: 0
      };
      resp[team].battles++;
    });

    resp[winner].wins++;
    if(shootdown === 'true') resp[winner].shootdowns++;
    resp[winner].rounds += parseInt(rounds);
    resp[winner].loss += parseFloat(loss);
  });

  const sorted = Object.values(resp).sort((a, b) => {
    return b.wins - a.wins || b.shootdowns - a.shootdowns || a.rounds - b.rounds || a.loss - b.loss || b.name - a.name;
  });

  const checkEqual = (arr1, arr2) => {
    if (!arr2) return false;
    for (const a in arr1) {
      if (!(a == 0 || a == 1 || a == 2)) {
        if (arr1[a] != arr2[a]) return false;
      }
    }
    return true;
  }

  let res = [];
  sorted.forEach((item, index) => {
    const row = [
      index + 1,
      item.name,
      item.battles,
      item.wins,
      item.shootdowns,
      item.rounds,
      `${item.loss}%`,
    ];
    const lastRow = res[res.length - 1];
    if (checkEqual(row, lastRow)) row[0] = lastRow[0];
    res.push(row);
  });
  return res;
};

const populateDiv = (divId, data) => {
  const div = document.getElementById(divId);

  div.innerHTML = 
    data ? data.map(row => `
      <div>
        ${row[2]} won in ${row[4]} Rounds ${row[3] === 'true' ? 'with shootout' : row[2] === row[1] ? 'by taking the flag' : 'by holding the fort'} and ${row[5]}% HP-Loss
      </div>
    `).join('') : '';
};

fetch('results.json')
  .then(response => response.json())
  .then(data => {
    const ids = ['A', 'B', 'C', 'D', '2A', '2B'];
    for (const id of ids) {
      populateTable('Group_' + id, sortTable(data['Group_' + id]));
      populateDiv('Results_' + id, data['Group_' + id]);
    }
  })
  .catch(error => console.error(error));

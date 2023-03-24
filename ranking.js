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
    return b.wins - a.wins || b.shootdowns - a.shootdowns || a.rounds - b.rounds || a.loss - b.loss;
  });

  return sorted.map((item, index) => [
    index + 1,
    item.name,
    item.battles,
    item.wins,
    item.shootdowns,
    item.rounds,
    `${item.loss}%`
  ]);
};

fetch('results.json')
  .then(response => response.json())
  .then(data => {
    const ids = ['A', 'B', 'C', 'D', '2A', '2B'];
    for (const id of ids) {
      const name = 'Group_' + id;
      populateTable(name, sortTable(data[name]));
    }
  })
  .catch(error => console.error(error));

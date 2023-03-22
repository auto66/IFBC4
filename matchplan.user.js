// ==UserScript==
// @name         TW IFBC matchplan
// @namespace    http://tampermonkey.net/
// @version      1
// @description  title
// @author       auto66
// @include      http*://*.the-west.*/game.php*
// @grant        none
// ==/UserScript==
(function (js) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + js + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  var TS = {};
  TS.createTSButton = function () {
    const icon = document.createElement('div');
    icon.classList.add('menulink');
    icon.classList.add('lminimap');
    icon.title = 'IFBC Title';
    icon.addEventListener('click', function () {
      TS.openWindow();
    });
    const bottom = document.createElement('div');
    bottom.classList.add('menucontainer_bottom');
    const content = document.createElement('div');
    content.classList.add('ui_menucontainer');
    content.id = 'TS';
    content.appendChild(icon);
    content.appendChild(bottom);
    document
      .querySelector('#ui_menubar')
      .appendChild(content);
  };

  TS.openWindow = async function () {
    TS.teams = await $.getJSON('//auto66.github.io/IFBC4/teams.json')
    const content = $('<div></div>');

    // Stage 1
    const left1 = $('<div style="position: absolute;left: 0px;width: 125px;height: 600px;"></div>');
    const right1 = $('<div style="position: absolute;right: 0px;width: 125px;height: 600px;"></div>');

    const items = ['A', 'B', 'C', 'D', '2A', '2B'];

    items.forEach(item => {
      const table = new west.gui.Table();
      table.addColumn('TS_team', 'Team').appendToCell('head', 'TS_Team', `Group ${item}`);
      table.bodyscroll.divMain.style.height = '175px';

      TS.teams['Group_' + item].forEach(e => {
        table.appendRow().appendToCell(-1, 'TS_Team', e);
      });

      if (item === '2A' || item === '2B') {
        table.getMainDiv().css('margin-top', '120px');
      }

      table.getMainDiv().css('text-indent', '5px');

      TS['table' + item] = table;
    });

    let scrollbarLeft1 = new west.gui.Scrollpane();
    scrollbarLeft1.appendContent(
      '<div class="rp_job_header" style="text-align: center;line-height: 30px;margin: 5px 0 10px 0;font-size: 18px;font-weight: bold;">Stage 1</div>')
      .appendContent(TS.tableA.getMainDiv())
      .appendContent(TS.tableC.getMainDiv());
    $(scrollbarLeft1.getMainDiv()).css('height', '625px');

    let scrollbarRight1 = new west.gui.Scrollpane();
    scrollbarRight1.appendContent(
      '<div class="rp_job_header" style="text-align: center;line-height: 30px;margin: 5px 0 10px 0;font-size: 18px;font-weight: bold;">Stage 1</div>')
      .appendContent(TS.tableB.getMainDiv())
      .appendContent(TS.tableD.getMainDiv());
    $(scrollbarRight1.getMainDiv()).css('height', '625px');

    left1.append(scrollbarLeft1.getMainDiv());
    right1.append(scrollbarRight1.getMainDiv());


    // Stage 2
    const left2 = $('<div style="position: absolute;left: 130px;width: 125px;height: 600px;"></div>');
    const right2 = $('<div style="position: absolute;right: 130px;width: 125px;height: 600px;"></div>');

    let scrollbarLeft2 = new west.gui.Scrollpane();
    scrollbarLeft2.appendContent(
      '<div class="rp_job_header" style="text-align: center;line-height: 30px;margin: 5px 0 10px 0;font-size: 18px;font-weight: bold;">Stage 2</div>')
      .appendContent(TS.table2A.getMainDiv());
    $(scrollbarLeft2.getMainDiv()).css('height', '625px');

    let scrollbarRight2 = new west.gui.Scrollpane();
    scrollbarRight2.appendContent(
      '<div class="rp_job_header" style="text-align: center;line-height: 30px;margin: 5px 0 10px 0;font-size: 18px;font-weight: bold;">Stage 2</div>')
      .appendContent(TS.table2B.getMainDiv());
    $(scrollbarRight2.getMainDiv()).css('height', '625px');

    left2.append(scrollbarLeft2.getMainDiv());
    right2.append(scrollbarRight2.getMainDiv());


    // Stage 3
    const middle = $('<div style="height: 600px;width: 690px;margin: 0 auto;background-image: url(https://cdn.discordapp.com/attachments/970385803945595010/1088092354503774319/fort-blur.png);background-position-x: center;background-position-y: center;background-repeat: no-repeat;"></div>');

    function createGroupframe(title, t1, t2, scale) {
      const innerBox = $('<div></div>')
        .append(t1 + '<br>')
        .append(`<img src="/images/window/cityhall/horizontal_divider.png" width="${scale ? scale : 100}%"><br>`)
        .append(t2);
      const titleElem = $('<b></b>').append(title);
      const box = new west.gui.Groupframe().appendToContentPane(innerBox);
      const div = $('<div></div>').append(titleElem).append(box.getMainDiv());
      $(div).css({
        'width': '130px',
        'text-align': 'center',
        'position': 'absolute',
      });
      return div;
    }

    const Div1 = createGroupframe('Quarterfinal 1', TS.teams.Quarter_1[0], TS.teams.Quarter_1[1]).css({ 'left': '0', 'top': '125px' });
    const Div2 = createGroupframe('Quarterfinal 2', TS.teams.Quarter_2[0], TS.teams.Quarter_2[1]).css({ 'left': '0', 'top': '325px' });
    const Div3 = createGroupframe('Quarterfinal 3', TS.teams.Quarter_3[0], TS.teams.Quarter_3[1]).css({ 'right': '0', 'top': '125px' });
    const Div4 = createGroupframe('Quarterfinal 4', TS.teams.Quarter_4[0], TS.teams.Quarter_4[1]).css({ 'right': '0', 'top': '325px' });
    const Div5 = createGroupframe('Semifinal 1', TS.teams.Semi_1[0], TS.teams.Semi_1[1]).css({ 'left': '130px', 'top': '225px' });
    const Div6 = createGroupframe('Semifinal 2', TS.teams.Semi_2[0], TS.teams.Semi_2[1]).css({ 'right': '130px', 'top': '225px' });
    const Div7 = createGroupframe('Final', TS.teams.Final[0], TS.teams.Final[1]).css({ 'left': '245px', 'top': '120px', 'width': '200px', 'font-size': '18px' });
    const Div8 = createGroupframe('Third Place', TS.teams.ThirdPlace[0], TS.teams.ThirdPlace[1]).css({ 'left': '280px', 'top': '300px' });
    const Div9 = createGroupframe('', '4th International Fort Battle Champion', TS.teams.Winer, 50).css({ 'left': '170px', 'top': '430px', 'width': '350px', 'font': 'bold 14pt "Times New Roman"' });


    const scrollbarmiddle = new west.gui.Scrollpane();
    scrollbarmiddle
      .appendContent(
        `<div class="rp_job_header" style="text-align: center;line-height: 30px;margin: 5px 0 10px 0;font-size: 18px;font-weight: bold;background: url('https://westde.innogamescdn.com/images/window/report/headerband_report.png') repeat">Stage 3</div>`
      )
      .appendContent('<img src="/images/items/yield/item_52040.png" style="position:absolute;left:309px">')
      .appendContent('<img src="/images/items/yield/item_52150.png" style="position:absolute;left:282px;width:50px;top:60px">')
      .appendContent('<img src="/images/items/yield/item_52151.png" style="position:absolute;right:280px;width:50px;top:60px">')
      .appendContent(Div1)
      .appendContent(Div2)
      .appendContent(Div3)
      .appendContent(Div4)
      .appendContent(Div5)
      .appendContent(Div6)
      .appendContent(Div7)
      .appendContent(Div8)
      .appendContent(Div9);
    scrollbarmiddle.getMainDiv().style.height = '625px';

    middle.append(scrollbarmiddle.getMainDiv());


    content.append(left1);
    content.append(right1);
    content.append(left2);
    content.append(right2);
    content.append(middle);

    TS.window = wman
      .open(
        'west_player_searcher',
        '4th International Fort Battle Championship',
        'noreload'
      )
      .setSize(1260, 625)
      .setMiniTitle('IFBC')
      .appendToContentPane(content);

    $('.tw2gui_window_inset', TS.window.getMainDiv()).css(
      'background-image',
      'url(https://tomrobert.safe-ws.de/LT_backGr.jpg)'
    );
  };

  TS.createTSButton();
})

// TODO => write data to json file, add totals columns
$(document).ready(function(){
    const data = JSON.parse(document.getElementById("data").innerText);
    const sections = getSectionNames(data);
    renderSectionOptions(getSectionNames(data));
    renderRowOptions(getRowNames(data,$('#section').val()));
    renderMonthOptions();
    renderTable(buildTable(data),getTitles(data));
    $('.form').on('submit',function(ev){
        ev.preventDefault();
        onSubmit(sections);  
    })
    $('#section').on('change',function(){
        $('#rows').empty();
        renderRowOptions(getRowNames(data,$('#section').val()));
    })
});
const headers = [' ','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec','TTL','AVG'];
function onSubmit(sections){
    const section = sections[$('#section').val()];
    const row = $('#rows').val();
    const month = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf($('#month').val());
    const amount = $('#amount').val();
    location.href = `${window.location.href}${section}/${row}/${month}/${amount}`;
}
function renderSectionOptions(data){
    $('#section').append(data.map((option,i) => `<option value=${i}>${option}</option>`));
}
function renderRowOptions(data){
    $('#rows').append(data.map(option => `<option value=${option}>${option}</option>`));
}
function renderMonthOptions(){
    $('#month').append(headers.filter(ent => /[a-z]{3}/.test(ent)).map(month => `<option value=${month}>${renderMonth(month)}</option>`));
}
function renderTable(data,titles){
    $('.table thead tr').append(renderTableHeader());
    $('.table tbody').append(renderTableBody(data,titles));
}
function renderTableHeader(){
    return headers.map(header => `<th>${header.toUpperCase()}</th>`);
}
function renderCamelCase(){
    
}
function renderCurrency(num){
    if(typeof num !== 'number') return num;
    return `£${num.toFixed(2)}`;
}
function renderMonth(month){
    switch(month){
        case 'jan':
            return 'January';
        case 'feb':
            return 'February';
        case 'mar':
            return 'March';
        case 'apr':
            return 'April';
        case 'may':
            return 'May';
        case 'jun':
            return 'June';
        case 'jul':
            return 'July';
        case 'aug':
            return 'August';
        case 'sep':
            return 'September';
        case 'oct':
            return 'October';
        case 'nov':
            return 'November';
        case 'dec':
            return 'December';
    }
}
function buildTable(data){
    function getRowColumns(data){
        return data.map(section => {
            return section.rows.map(row => {
                return row.amounts.map(amount => {
                    return amount;
                }).concat(getRowTotal(row.amounts),getRowAverage(row.amounts));
            })
        })
    }
    function getRowTotal(row){
        return row.map(month => month).reduce((a,b) => a+b);
    }
    function getRowAverage(row){
        return row.map(month => month).reduce((a,b) => a+b)/12;
    }
    function getSectionTotals(data){
        const totals = data.map(row => row.map(data => data));
        let sectionTotals = [];
        for (let i = 0; i < data[0].length; i++){
          sectionTotals.push(totals.map(row => row[i]).reduce((a,b) => a+b));
        }
        return sectionTotals;
    }
    return getRowColumns(data).map(section => {
        const totals = getSectionTotals(section);
        return [totals].concat(section);
    })
}
function getSectionNames(data){
    return data.map(section => section.name);
}
function getRowNames(data,i){
    return data.map(section => section.rows.map(row => row.name))[i];
}
function getTitles(data){ // this is using the raw data
    const sections =  data.map(section => section.name);
    const rows = data.map(section => section.rows.map(row => row.name))
    let arr = [];
    for (let i=0;i<sections.length;i++){
        arr.push([sections[i]].concat(rows[i]))
    }
    return arr;
}
function renderTableBody(data,titles){ // this is using the buildTable data
    function addNames(sections,data){
        let ans = [];
        function addRowName(sections,rows){
          return sections.map((section,i) => [section].concat(rows[i]));
        }
        sections.forEach((name,i) => ans.push(addRowName(sections[i],data[i])));
        return ans;
    }
    return addNames(titles,data).map(section => `${section.map((row,i) => `<tr ${i===0 ? 'style="background-color:grey; color:white"' : ""}>${row.map(cell => `<td>${renderCurrency(cell)}</td>`)}</tr>`)}`)
}

// current data
[
    {
        "name":"blackRio",
        "rows":[
            {"name":"petrol","amounts":[100,100,100,100,100,100,100,100,100,100,100,100]},
            {"name":"insurance","amounts":[200,200,200,200,200,200,200,200,200,200,200,200]},
            {"name":"tax","amounts":[0,0,0,0,0,30,0,0,0,0,0,0]}
        ]
    },
    {
        "name":"redRio",
        "rows":[
            {"name":"petrol","amounts":[100,100,100,100,100,100,100,100,100,100,100,100]},
            {"name":"insurance","amounts":[200,200,200,200,200,200,200,200,200,200,200,200]},
            {"name":"tax","amounts":[0,0,0,0,0,30,0,0,0,0,0,0]}
        ]
    },
    {
        "name":"home",
        "rows":[
            {"name":"mortgage","amounts":[300,300,300,300,300,300,300,300,300,300,300,300]},
            {"name":"groundRent","amounts":[400,400,400,400,400,400,400,400,400,400,400,400]},
            {"name":"gas","amounts":[500,500,500,500,500,500,500,500,500,500,500,500]},
            {"name":"electric","amounts":[12,13,14,16,30,20,12,17,27,30,12,10]},
            {"name":"homeInsurance","amounts":[0,0,0,0,0,0,150,0,0,0,0,0]}
        ]
    }
]

// const data2 = [
//     {
//       "name":"blackRio",
//       "rows":[
//         {
//           "name":"petrol",
//           "amounts":[
//             {"col":"jan","total":100},
//             {"col":"feb","total":100},
//             {"col":"mar","total":100},
//             {"col":"apr","total":100},
//             {"col":"may","total":100},
//             {"col":"jun","total":100},
//             {"col":"jul","total":100},
//             {"col":"aug","total":100},
//             {"col":"sep","total":100},
//             {"col":"oct","total":100},
//             {"col":"nov","total":100},
//             {"col":"dec","total":100}
//           ]
//         },
//         {
//           "name":"insurance",
//           "amounts":[
//             {"col":"jan","total":200},
//             {"col":"feb","total":200},
//             {"col":"mar","total":200},
//             {"col":"apr","total":200},
//             {"col":"may","total":200},
//             {"col":"jun","total":200},
//             {"col":"jul","total":200},
//             {"col":"aug","total":200},
//             {"col":"sep","total":200},
//             {"col":"oct","total":200},
//             {"col":"nov","total":200},
//             {"col":"dec","total":200}
//           ]
//         }
//       ]
//     },
//     {
//       "name":"home",
//       "rows":[
//         {
//           "name":"mortgage",
//           "amounts":[
//             {"col":"jan","total":300},
//             {"col":"feb","total":300},
//             {"col":"mar","total":300},
//             {"col":"apr","total":300},
//             {"col":"may","total":300},
//             {"col":"jun","total":300},
//             {"col":"jul","total":300},
//             {"col":"aug","total":300},
//             {"col":"sep","total":300},
//             {"col":"oct","total":300},
//             {"col":"nov","total":300},
//             {"col":"dec","total":300}
//           ]
//         },
//         {
//           "name":"groundRent",
//           "amounts":[
//             {"col":"jan","total":400},
//             {"col":"feb","total":400},
//             {"col":"mar","total":400},
//             {"col":"apr","total":400},
//             {"col":"may","total":400},
//             {"col":"jun","total":400},
//             {"col":"jul","total":400},
//             {"col":"aug","total":400},
//             {"col":"sep","total":400},
//             {"col":"oct","total":400},
//             {"col":"nov","total":400},
//             {"col":"dec","total":400}
//           ]
//         },
//         {
//           "name":"gas",
//           "amounts":[
//             {"col":"jan","total":500},
//             {"col":"feb","total":500},
//             {"col":"mar","total":500},
//             {"col":"apr","total":500},
//             {"col":"may","total":500},
//             {"col":"jun","total":500},
//             {"col":"jul","total":500},
//             {"col":"aug","total":500},
//             {"col":"sep","total":500},
//             {"col":"oct","total":500},
//             {"col":"nov","total":500},
//             {"col":"dec","total":500}
//           ]
//         }
//     ]
//     }       
// ];

// function buildTable(data){
//     function getRowColumns(data){
//         return data.map(section => {
//             return section.rows.map(row => {
//                 return row.amounts.map(amount => {
//                     return amount;
//                 }).concat({col:'total',total:getRowTotal(row.amounts)},{col:'average',total:getRowAverage(row.amounts)});
//             })
//         })
//     }
//     function getRowTotal(row){
//         return row.map(month => month.total).reduce((a,b) => a+b);
//     }
//     function getRowAverage(row){
//         return row.map(month => month.total).reduce((a,b) => a+b)/12;
//     }
//     function getSectionTotals(data){
//         const totals = data.map(row => row.map(data => data.total));
//         let sectionTotals = [];
//         for (let i = 0; i < data[0].length; i++){
//           sectionTotals.push(totals.map(row => row[i]).reduce((a,b) => a+b));
//         }
//         return sectionTotals;
//     }
//     return getRowColumns(data).map(section => {
//         const totals = getSectionTotals(section);
//         return [totals].concat(section);
//     })
// }

// const oldData = 
// {
//     "mortgage":{"jan":113.432434,"feb":350,"mar":400,"apr":450,"may":300,"jun":0,"jul":0,"aug":0,"sep":0,"oct":0,"nov":0,"dec":0},
//     "groundRent":{"jan":250,"feb":250,"mar":275,"apr":250,"may":250,"jun":250,"jul":250,"aug":250,"sep":250,"oct":250,"nov":250,"dec":250},"petrol":{"jan":60.28,"feb":33,"mar":30,"apr":30,"may":30,"jun":30,"jul":30,"aug":30,"sep":30,"oct":30,"nov":30,"dec":30},
//     "gas":{"jan":30,"feb":30,"mar":30,"apr":30,"may":30,"jun":30,"jul":30,"aug":30,"sep":30,"oct":30,"nov":30,"dec":30}
// }
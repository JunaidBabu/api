const fs = require('fs');
const rawDistData = require('../tmp/district_wise.json');
// console.log(rawDistData.districts[1]);

const StateDistrictWiseData = rawDistData.districts.reduce((acc, row) => {
    if (+row.confirmed == 0) {
        return acc;
    }
    let stateName = row.state;
    if (!acc[stateName]) {
        acc[stateName] = {
            districtData: {},
            statecode: row.statecode
        };
    }
    let districtName = row.district;
    if (!acc[stateName].districtData[districtName]) {
        acc[stateName].districtData[districtName] = {
            active: 0,
            confirmed: 0,
            deceased: 0,
            recovered: 0,
            delta: {
                confirmed: 0,
                deceased: 0,
                recovered: 0
            }
        };
    }
    const currentDistrict = acc[stateName].districtData[districtName];
    currentDistrict.active = +row.active;
    currentDistrict.confirmed = +row.confirmed;
    currentDistrict.recovered = +row.recovered;
    currentDistrict.deceased = +row.deceased;
    currentDistrict.delta.confirmed = +row.deltaconfirmed;
    currentDistrict.delta.deceased = +row.deltadeceased;
    currentDistrict.delta.recovered = +row.deltarecovered;
    return acc;

}, {});

let stateDistrictWiseDataV2 = Object.keys(StateDistrictWiseData).map(state => {
    let districtData = StateDistrictWiseData[state].districtData;
    return {
      state,
      districtData: Object.keys(districtData).map(district => {
        return { district, ...districtData[district] };
      })
    }
  });

fs.writeFileSync('./tmp/state_district_wise.json', JSON.stringify(StateDistrictWiseData, null, 2));
fs.writeFileSync('./tmp/v2/state_district_wise.json', JSON.stringify(stateDistrictWiseDataV2, null, 2));
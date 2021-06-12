import './home.css';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown';
import React, { Component } from 'react';

import { getAllActive } from '../Actives/api/activeProxy'
import { getAll } from '../Companies/api/companyProxy'
import { getAllUnit } from '../Units/api/unitProxy'


drilldown(Highcharts);

export default class Home extends Component {
    state = {
        actives: [],
        units: [],

        unitsDrilldownNumber: [{}],
        companiesDataNumber: [{}],
        optionsNumber: {},
    
        unitsDrilldownHealth: [{}],
        companiesDataHealth: [{}],
        optionsHealth: {},
    }

    getUnitsByCompany(CompanyUnits) {
        let unitsByCompany = []
        CompanyUnits.forEach(companyUnit => {
            unitsByCompany = unitsByCompany.concat(this.state.units.filter(unit => unit.id === companyUnit));
        });
    
        return unitsByCompany;
    }

    getNumberActive(CompanyUnits) {
        let parcialResult = [];
        let finalResult = [];
       
        parcialResult = this.getUnitsByCompany(CompanyUnits);

        parcialResult.forEach(pr => {
            finalResult = finalResult.concat(pr.actives);
        })

        return finalResult.length;
    }

    getDrilldownNumber(CompanyUnits) {
        let unitsByCompany = [];
        
        unitsByCompany = this.getUnitsByCompany(CompanyUnits);

        let data = []
        unitsByCompany.forEach(pr => {
            data.push([pr.name, pr.actives.length])
        })
        return {
            name: 'Ativos',
            id: unitsByCompany[0]?.company,
            data: data
        }
    }

    getAvgHealthLevel(CompanyUnits) {
        let unitsByCompany = [];
    
        unitsByCompany = this.getUnitsByCompany(CompanyUnits);

        let activesByCompanies = [];
        unitsByCompany.forEach(units => {
            units.actives.forEach(activeId => {
                activesByCompanies = activesByCompanies.concat(this.state.actives.filter(active => active.id === activeId));
            })
        })
        let sum = 0;
        activesByCompanies.forEach(active => {
            sum += active.healthLevel;
        })

        let avg = (sum / activesByCompanies.length);

        if (!isNaN(avg)) {
            avg = parseFloat(avg.toFixed(2));            
        }
        return (avg);
    }

    getDrilldownHealth(CompanyUnits) {
        let unitsByCompany = [];
        let activesByCompanies = [];
        let activesByCompaniesTemp = [];
        let avg = [];
        let sumTemp = 0;
        let data = [];

        unitsByCompany = this.getUnitsByCompany(CompanyUnits);

        unitsByCompany.forEach(units => {
            units.actives.forEach(activeId => {
                activesByCompaniesTemp = activesByCompaniesTemp.concat(this.state.actives.filter(active => active.id === activeId));
            })
            data.push([units.name, 0])
            activesByCompanies.push(activesByCompaniesTemp);
            activesByCompaniesTemp = [];
        })
        activesByCompanies.forEach(actives => {
            actives.forEach(active => {
                sumTemp += active.healthLevel;
            })
            let mean = sumTemp / actives.length;
            if (!isNaN(mean)) {
                mean = parseFloat(mean.toFixed(2));            
            }
            avg.push(mean)
            sumTemp = 0;
        })
        data.forEach((data, index) => {
            data[1] = avg[index];
        })
        
        return {
            name: 'Nível de Saúde Médio',
            id: unitsByCompany[0]?.company,
            data: data
        }
    }

    async componentDidMount() {
        await getAllActive()
        .then(res => {
            const actives = res.data.elements;            
            this.setState({actives});
        });

        await getAllUnit()
        .then(res => {
            const units = res.data.elements;                
            this.setState({units});
        });
        
        await getAll()
            .then(res => {
                const companies = res.data.elements;
                let companiesDataNumber = []
                let unitsDrilldownNumber = [];

                let companiesDataHealth = [];
                let unitsDrilldownHealth = [];

                companies.forEach(company => {
                    companiesDataNumber.push({
                        name: company.name,
                        y: this.getNumberActive(company.units),
                        drilldown: company.id
                    })
                    unitsDrilldownNumber.push({
                        ...this.getDrilldownNumber(company.units)
                    })

                    companiesDataHealth.push({
                        name: company.name,
                        y: this.getAvgHealthLevel(company.units),
                        drilldown: company.id
                    })
                    unitsDrilldownHealth.push({
                        ...this.getDrilldownHealth(company.units)
                    })
                });

                this.setState({companiesDataNumber});
                this.setState({unitsDrilldownNumber});

                this.setState({companiesDataHealth});
                this.setState({unitsDrilldownHealth})
            });
        

            this.setState({optionsNumber: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Ativos por Empresas'
                },
                xAxis: {
                    type: 'category'
                },
                series: [{
                    name: 'Ativos',
                    colorByPoint: true,
                    data: this.state.companiesDataNumber
                }],
                drilldown: {
                    series: this.state.unitsDrilldownNumber
                }
               }
            })
            

            this.setState({optionsHealth: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Média dos Nívies de Saúde dos Ativos por Empresas'
                },
                xAxis: {
                    type: 'category'
                },
                series: [{
                    name: 'Nível de Saúde Médio',
                    colorByPoint: true,
                    data: this.state.companiesDataHealth
                }],
                drilldown: {
                    series: this.state.unitsDrilldownHealth
                }
               }
            })
    }

    render() {
        return (
            <React.Fragment>
                <HighchartsReact highcharts={Highcharts} options={this.state.optionsNumber}></HighchartsReact>
                <HighchartsReact highcharts={Highcharts} options={this.state.optionsHealth}></HighchartsReact>
            </React.Fragment>
        )
    }
}
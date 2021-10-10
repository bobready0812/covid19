import {useState, useEffect} from 'react'
import {Bar, Doughnut, Line} from "react-chartjs-2"
import axios from 'axios'

const Contents = () => {

    const [confirmedData, setConfirmedData] = useState({})
    const [quarantinedData, setQuarantinedData] = useState({})
    const [comparedData, setComparedData] = useState({})

    useEffect(() => {

        const fetchEvents = async () => {
            const res = await axios.get(
                "https://api.covid19api.com/total/dayone/country/kr"
            )
            makeData(res.data)
        }
        const makeData = (items) => {
            const arr = items.reduce((acc, cur) => {
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const death = cur.Death;
                const recovered = cur.Recoverd;

                const findItem = acc.find(a => a.year === year && a.month === month);

                if (!findItem) {
                    acc.push({
                        year,
                        month,
                        date,
                        confirmed,
                        active,
                        death,
                        recovered
                    })
                }
                if (findItem && findItem.date < date) {
                    findItem.active = active;
                    findItem.death = death;
                    findItem.month = month;
                    findItem.year = year;
                    findItem.recovered = recovered;
                    findItem.confirmed = confirmed;
                    findItem.date = date;

                }

                return acc;
            }, [])
            const labels = arr.map(a => `${a.month + 1}월`)
            setConfirmedData({
                labels,
                datasets: [
                    {
                        label: "국내 누적 확진자",
                        backgroundColor: "salmon",
                        fill: true,
                        data: arr.map(a => a.confirmed)

                    }

                ]

            });
            setQuarantinedData({
                labels,
                datasets: [
                    {
                        label: "월별 격리자 현황",
                        borderColor: "skyblue",
                        fill: false,
                        data: arr.map(a => a.active)

                    }

                ]

            })
        }
       

        fetchEvents()
    }, [])

    return (
        <section>
            <h2>국내 코로나 현황</h2>
            <div className="contents">
                <div>
                    <Bar
                        data={confirmedData}
                        options={{
                            title: {
                                display: true,
                                text: "누적 확진자 추이",
                                fontSize: 16
                            }
                        }, {
                            legend: {
                                display: true,
                                position: "bottom"
                            }
                        }
}/>
                </div>
                <div>
                    <Doughnut
                        data={quarantinedData}
                        options={{
                            title: {
                                display: true,
                                text: "월별 격리자 현황 추이",
                                fontSize: 16
                            }
                        }, {
                            legend: {
                                display: true,
                                position: "bottom"
                            }
                        }
}/>
                </div>
                <div>
                   
                </div>
            </div>
        </section>
    )
}

export default Contents

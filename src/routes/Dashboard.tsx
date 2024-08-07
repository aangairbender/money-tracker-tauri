import { useAppState } from "@hooks/useAppState";
import { BarChart } from "@tremor/react";
import { Card, Col, DatePicker, Row, Space } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import Chart from "chart.js/auto";

const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

Chart.overrides['doughnut'].plugins.legend.position = 'right';

interface YearExpensesProps {
    year: number;
}

const YearExpenses: React.FC<YearExpensesProps> = (props) => {
    const { transactions } = useAppState();
    const expensesPerMonth: number[] = new Array(12).fill(0);
    const incomePerMonth: number[] = new Array(12).fill(0);
    transactions.forEach(t => {
        const date = new Date(t.date);
        if (date.getFullYear() !== props.year) return;
        if (t.amount < 0) {
            expensesPerMonth[date.getMonth()] -= t.amount;
        } else {
            incomePerMonth[date.getMonth()] += t.amount;
        }
    });

    const chartData = expensesPerMonth.map((e, i) => ({
        month: months[i],
        expense: e,
        income: incomePerMonth[i],
    }));

    return (
        <BarChart
            data={chartData}
            index="month"
            categories={['expense', 'income']}
            colors={['red', 'green']}
            yAxisWidth={16}
        />
    );
};

interface CategoryPieProps {
    from: dayjs.Dayjs | null;
    to: dayjs.Dayjs | null;
}

const CategoryPie: React.FC<CategoryPieProps> = (props: CategoryPieProps) => {
    const { transactions, categories } = useAppState();
    const data = categories.map(c => ({
        id: c.id,
        name: c.name,
        color: c.color,
        expense: 0,
    }));
    transactions.forEach(t => {
        const tDate = dayjs(t.date);
        const category = categories.find(c => c.substrings.some(sub => t.summary.includes(sub)));
        if (!category || t.amount >= 0) return;
        if (!props.from || tDate.isBefore(props.from, 'month')) return;
        if (!props.to || tDate.isAfter(props.to, 'month')) return;
        data.find(d => d.id == category.id)!.expense -= t.amount;
    });

    const pieData = {
        labels: data.map(d => d.name),
        datasets: [{
            label: 'Expenses',
            data: data.map(d => d.expense),
            backgroundColor: data.map(d => d.color)
        }]
    };

    return (<Doughnut data={pieData}/>);
};

const Dashboard: React.FC = () => {
    const [date, setDate] = useState<CategoryPieProps>({from: dayjs(), to: dayjs()});

    return (
        <Space direction="vertical" size="middle" style={{display: 'flex'}}>
            <Row gutter={16}>
                <Col span={12}>
                    <Card bordered={false} title="Current year">
                        <YearExpenses year={new Date().getFullYear()}/>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={false} title="Last year">
                        <YearExpenses year={new Date().getFullYear() - 1}/>
                    </Card>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <Card bordered={false} title="Expense by category">
                        <DatePicker.RangePicker
                            picker="month"
                            value={[date.from, date.to]}
                            onChange={date => setDate(date ? {from: date[0], to: date[1]} : {from:null, to:null})}/>
                        <CategoryPie {...date}/>
                    </Card>
                </Col>
            </Row>
        </Space>
    )
};

export default Dashboard;

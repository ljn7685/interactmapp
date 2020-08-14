import React, { Component } from 'react';
import { View, Text } from "@tarojs/components";
import PickerView from "../pickerView";
import propTypes from 'prop-types';
import "./index.scss";

class DatePicker extends Component {
    constructor (props) {
        super(props);
        this.state = {
            mode: 'date', // date:选择日期模式, time:选择时间模式
            startDate: null, // 最早可选日期
            endDate: null, // 最晚可选日期
            currentDate: null, // 当前月日期
            currentDateStr: null, // 2018-12
            selectedDate: null, // 选中日期
            selectedDateStr: null, // 选中日期字符格式,用于和dayStr比较
            selectedDateShow: null, // 选中日期显示 2018-12-12
            currentData: null, // 当前渲染数据
            hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            minutes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
            seconds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
            initTimeValue: [0, 0, 0], // 初始化选中时间的时,分,秒
            timeValue: [0, 0, 0], // 选中时间的时,分,秒，
            pickerShow: props.pickerShow,
        };
    }
    componentDidMount () {
        let { rangeStart, rangeEnd, date } = this.props;
        this.initRangeStart(rangeStart);
        this.initRangeEnd(rangeEnd);
        this.initDate(date);
    }
    componentDidUpdate (prevProps, prevState) {
        const { date, rangeStart, rangeEnd  } = this.props;
        const { currentDate } = this.state;
        if (prevProps.date !== date) {
            this.initDate(date);
        }
        if (prevState.currentDate !== currentDate) {
            this.setMonthData();
        }
        if (prevProps.rangeStart !== rangeStart) {
            this.initRangeStart(rangeStart);
        }
        if (prevProps.rangeEnd !== rangeEnd) {
            this.initRangeEnd(rangeEnd);
        }
    }
    /**
	 * pickview change回调
	 * @param {*} e 
	 */
    bindChange (values) {
        // const values = e.detail.value;
        console.log('new timevalue', values);
        this.setState({ timeValue: values });
    }
    /**
	 *  切换模式
	 */
    toggleMode () {
        if (this.state.mode === 'date') {
            let date = this.props.date ? new Date(this.props.date) : new Date();
            let hour = date.getHours();
            let minute = date.getMinutes();
            let second = date.getSeconds();
            this.setState({
                initTimeValue: [hour, minute, second],
                timeValue: [hour, minute, second],
                mode: 'time',
            });
        } else {
            this.setState({ mode: 'date' });
        }
    }
    /**
	 * 取消按钮点击
	 */
    cancel () {
        this.setState({ pickerShow: false });
        setTimeout(() => {
            this.setState({ mode: 'date' });
        }, 300);
        this.initDate(this.props.date);
    }
    /**
	 * 确定按钮点击
	 */
    confirm () {
        this.setState({
            pickerShow: false,
            mode: 'date',
        });
        let selectedDate = this.state.selectedDate;
        let year = selectedDate.getFullYear(), month = selectedDate.getMonth(), day = selectedDate.getDate();
        let timeValue = this.state.timeValue;
        let newDate = new Date(year, month, day, timeValue[0], timeValue[1], timeValue[2]);
        let dateStr = [year, month + 1, day].map(this.fixZero).join('-');
        let dateTimeStr = [year, month + 1, day].map(this.fixZero).join('-') + ' ' + timeValue.map(this.fixZero).join(':');
        this.props.onSelect({ date: newDate, dateStr: dateStr, dateTimeStr: dateTimeStr });
    }
    /**
	 * 验证日期有效
	 * @param {*} date 
	 */
    isValidDay (date) {
        let { startDate, endDate } = this.state;
        const { needWeek } = this.props;

        let valid = false;

        if (startDate && endDate) { // 开始日期和结束日期都存在
            if (date >= startDate && date < endDate) {
                valid = true;
            }
        } else if (startDate && !endDate) { // 开始日期存在结束日期不存在
            if (date >= startDate) {
                valid = true;
            }
        } else if (!startDate && endDate) { // 开始日期不存在结束日期存在
            if (date < endDate) {
                valid = true;
            }
        } else {
            valid = true;
        }

        if (!needWeek) {
            let weekDay = date.getDay();
            if (weekDay === 0 || weekDay === 6) {
                valid = false;
            }
        }
        return valid;
    }
    /**
	 * 设置月份数据
	 */
    setMonthData () {

        const currentDate = this.state.currentDate;
        console.log('setMonthData', currentDate);
        let year = currentDate.getFullYear(), month = currentDate.getMonth();

        // 当月所有天数的数据结构
        let currentData = [];

        // 获取当月1号的星期0~6
        let firstDayWeek = new Date(year, month, 1).getDay();

        // 天数, 用来标识当前是本月中的哪一天
        let dayIndex = 0;

        // 第1行
        let firstCol = [];

        for (let i = 0; i < 7; i++) {
            if (i < firstDayWeek) {
                let date = new Date(year, month, dayIndex - (firstDayWeek - i) + 1);
                let valid = this.isValidDay(date);
                firstCol.push({
                    date: date,
                    dateStr: date.toString(),
                    day: date.getDate(),
                    valid: valid,
                    currentMonth: false,
                });
            } else {
                dayIndex += 1;
                let date = new Date(year, month, dayIndex);
                let valid = this.isValidDay(date);
                firstCol.push({
                    date: date,
                    dateStr: date.toString(),
                    day: dayIndex,
                    valid: valid,
                    currentMonth: true,
                });
            }
        }

        currentData.push(firstCol);
        console.log('currentData', currentData);
        // 第2～4行
        for (let i = 0; i < 3; i++) {
            let col = [];
            for (let j = 0; j < 7; j++) {
                dayIndex += 1;
                let date = new Date(year, month, dayIndex);
                let valid = this.isValidDay(date);
                col.push({
                    date: date,
                    dateStr: date.toString(),
                    day: dayIndex,
                    valid: valid,
                    currentMonth: true,
                });
            }
            currentData.push(col);
        }

        // 第5行
        let lastCol = [];

        // 余下一行中本月的天数
        let restDay = new Date(year, month + 1, 0).getDate() - dayIndex;

        for (let i = 0; i < 7; i++) {
            if (i < restDay) {
                dayIndex += 1;
                let date = new Date(year, month, dayIndex);
                let valid = this.isValidDay(date);
                lastCol.push({
                    date: date,
                    dateStr: date.toString(),
                    day: dayIndex,
                    valid: valid,
                    currentMonth: true,
                });
            } else {
                let date = new Date(year, month + 1, i - restDay + 1);
                let valid = this.isValidDay(date);
                lastCol.push({
                    date: date,
                    dateStr: date.toString(),
                    day: date.getDate(),
                    valid: valid,
                    currentMonth: false,
                });
            }
        }

        currentData.push(lastCol);

        let restDay2 = restDay - 7;

        // 第6行
        let lastCol2 = [];

        for (let i = 0; i < 7; i++) {
            if (i < restDay2) {
                dayIndex += 1;
                let date = new Date(year, month, dayIndex);
                let valid = this.isValidDay(date);
                lastCol2.push({
                    date: date,
                    dateStr: date.toString(),
                    day: dayIndex,
                    valid: valid,
                    currentMonth: true,
                });
            } else {
                let date = new Date(year, month + 1, i - restDay2 + 1);
                let valid = this.isValidDay(date);
                lastCol2.push({
                    date: date,
                    dateStr: date.toString(),
                    day: date.getDate(),
                    valid: valid,
                    currentMonth: false,
                });
            }
        }

        currentData.push(lastCol2);

        this.setState({ currentData: currentData });
        console.log('currentData', currentData);
    }
    /**
	 * 改变日期
	 * @param {*} event 
	 */
    changeDate (type) {
        let currentDate = this.state.currentDate;
        let year = currentDate.getFullYear(), month = currentDate.getMonth();
        console.log('changeDate type', type);
        switch (type) {
            case 'year-':
                currentDate.setFullYear(year - 1);
                break;
            case 'year+':
                currentDate.setFullYear(year + 1);
                break;
            case 'month-':
                currentDate.setMonth(month - 1);
                break;
            case 'month+':
                currentDate.setMonth(month + 1);
                break;
        }

        this.setCurrentDate(currentDate);

    }
    /**
	 * 选择日期
	 * @param {*} event 
	 */
    chooseDate (i, j) {

        let td = this.state.currentData[i][j];

        if (td.valid) {
            this.setSelectedDate(td.date);
        }

    }
    /**
	 * 数字前面添加0
	 * @param {*} value 
	 */
    fixZero (value) {
        if (value < 10) {
            return "0" + value;
        } else {
            return value;
        }
    }
    /**
	 * 设置当前日期
	 * @param {*} date 
	 */
    setCurrentDate (date) {
        if (!date) {
            this.setState({
                currentDate: null,
                currentDateStr: null,
            });
        } else {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const dateStr = [year, month].map(this.fixZero).join('-');
            console.log('currentDate', date);
            this.setState({
                currentDate: new Date(date.getTime()),
                currentDateStr: dateStr,
            });
        }
    }
    /**
	 * 设置选择日期
	 * @param {*} date 
	 */
    setSelectedDate (date) {
        if (!date) {
            this.setState({
                selectedDate: null,
                selectedDateStr: null,
                selectedDateShow: null,
            });
            return;
        } else {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const selectedDateShow = [year, month, day].map(this.fixZero).join('-');
            this.setState({
                selectedDate: date,
                selectedDateStr: date.toString(),
                selectedDateShow: selectedDateShow,
            });
        }
    }
    /**
	 * 初始化开始范围
	 * @param {*} value 
	 */
    initRangeStart (value) {
        if (value) {
            let date = new Date(value);
            this.setState({ startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()) });
        }
    }
    /**
	 * 初始化结束范围
	 * @param {*} value 
	 */
    initRangeEnd (value) {
        if (value) {
            let date = new Date(value);
            this.setState({ endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 24) });
        }
    }
    /**
	 * 初始化日期
	 * @param {*} value 
	 */
    initDate (value) {
        let date = value ? new Date(value) : new Date();
        let year = date.getFullYear(), month = date.getMonth(), day = date.getDate();
        console.log('initDate', value, date);
        this.setCurrentDate(new Date(year, month, day));
        this.setSelectedDate(new Date(year, month, day));
    }
    render () {
        console.log('render');
        const { mode, currentDateStr, pickerShow, timeValue, selectedDateStr, selectedDateShow, currentData, hours, minutes, seconds, initTimeValue } = this.state;
        const timeData = [
            hours.map(item => ({ value:item, label:item + "时" })),
            minutes.map(item => ({ value:item, label:item + "分" })),
            seconds.map(item => ({ value:item, label:item + "秒" })),
        ];
        return (<View>
            <View className={`modal ${pickerShow ? 'modal-show' : 'modal-hide'}`} catchtouchmove='true' onClick={this.cancel.bind(this)}></View>
            <View className={`picker ${pickerShow ? 'picker-show' : 'picker-hide'}`}>
                {mode === 'date' && <View className='date-header' >
                    <View className='btn doubleLeft' onClick={this.changeDate.bind(this, 'year-')} >
                        <Text className='iconfont-picker icon-arrow-double-left'></Text>
                    </View>
                    <View className='btn left' onClick={this.changeDate.bind(this, 'month-')} >
                        <Text className='iconfont-picker icon-arrow-left'></Text>
                    </View>
                    <View className='month'>
                        {currentDateStr}
                    </View>
                    <View className='btn right' onClick={this.changeDate.bind(this, 'month+')} >
                        <Text className='iconfont-picker icon-arrow-right'></Text>
                    </View>
                    <View className='btn doubleRight' onClick={this.changeDate.bind(this, 'year+')} >
                        <Text className='iconfont-picker icon-arrow-double-right'></Text>
                    </View>
                </View>}
                {mode === 'date' && <View className='date-body' >
                    <View className='tr'>
                        <View className='th'>
                            <View className='cell'>日</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>一</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>二</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>三</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>四</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>五</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>六</View>
                        </View>
                    </View>
                    {currentData && currentData.map((tr, i) => (
                        <View className='tr'
                            key={i}
                        >
                            {tr.map((td, j) => (
                                <View className='td'
                                    key={j}
                                    onClick={this.chooseDate.bind(this, i, j)}
                                >
                                    <View hoverClass='none'
                                        className={`cell ${td.currentMonth ? '' : 'otherMonth'} ${td.valid ? '' : 'disabled'} ${td.date && td.dateStr === selectedDateStr ? 'cur' : ''}`}
                                    >
                                        {td.day}
                                    </View>
                                </View>

                            ))}
                        </View>
                    ))}
                </View>
                }
                {mode === 'time' && <View className='time-header' >
                    <View className='date'>
                        {selectedDateShow}
                    </View>
                </View>}
                {mode === 'time' && <View className='time-body' >
                    <PickerView indicatorClass='selectItem' data={timeData} col={timeData.length} value={timeValue || initTimeValue} onChange={this.bindChange.bind(this)} className='picker-view' />
                </View>}
                <View className='bottom'>
                    {mode === 'date' && <View className='btn btn-cancel' onClick={this.cancel.bind(this)} >
                        <View hoverClass='hover' hoverStartTime='0'>取消</View>
                    </View>}
                    {mode !== 'date' && <View className='btn btn-cancel' onClick={this.toggleMode.bind(this)} >
                        <View hoverClass='hover' hoverStartTime='0'>返回</View>
                    </View>}

                    <View className='bd'></View>
                    {mode === 'date' && <View className='btn btn-confirm' onClick={this.toggleMode.bind(this)}>
                        <View hoverClass='hover' hoverStartTime='0'>选时间</View>
                    </View>}
                    {mode !== 'date' && <View className='btn btn-confirm' onClick={this.confirm.bind(this)} >
                        <View hoverClass='hover' hoverStartTime='0'>完成</View>
                    </View>}
                </View>
            </View>
        </View>);
    }
}
DatePicker.defaultProps = {
    needWeek: true,
    pickerShow: false,
};
DatePicker.propTypes = {
    date: propTypes.oneOfType([propTypes.number, propTypes.string]),
    rangeStart: propTypes.oneOfType([propTypes.number, propTypes.string]),
    rangeEnd: propTypes.oneOfType([propTypes.number, propTypes.string]),
    onSelect: propTypes.func,
    needWeek: propTypes.bool,
    pickerShow: propTypes.bool,
};

export default DatePicker;

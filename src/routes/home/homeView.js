import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { View } from 'react-native';
import { TabBar, Text } from 'antd-mobile';

/**
 * router
 * 首页
 */
const TabBarItem = TabBar.Item;
class HomeView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'tab1',
        };
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'home/fetchDataDemo',
            uid: '1',
        });
    }


    render() {
        return (
            <TabBar>
                <TabBarItem
                    onPress={() => { this.setState({ selectedTab: 'tab1' }) }}
                    selected={this.state.selectedTab === 'tab1'}
                    icon={require('./../../../resource/homeTab/home.png')}
                    selectedIcon={require('./../../../resource/homeTab/home_selected.png')}
                    title="tab1"
                >
                    <View style={{ flex: 1, backgroundColor: 'green' }} >
                        <View style={{ height: 20 }}></View>
                        <Text>{this.props.id}</Text>
                        <Text>{this.props.name}</Text>
                        <Text>{this.props.desc}</Text>
                    </View>
                </TabBarItem>
                <TabBarItem
                    onPress={() => { this.setState({ selectedTab: 'tab2' }) }}
                    selected={this.state.selectedTab === 'tab2'}
                    icon={require('./../../../resource/homeTab/prompt.png')}
                    selectedIcon={require('./../../../resource/homeTab/prompt_selected.png')}
                    title="tab2"
                >
                    <View style={{ flex: 1, backgroundColor: 'red' }} />
                </TabBarItem>
            </TabBar>
        );
    }
}

HomeView.propTypes = {
};

const mapStateToProps = (state) => {
    const id = state.home.id;
    const name = state.home.name;
    const desc = state.home.desc;
    return { id, name, desc };
};
export default connect(mapStateToProps)(HomeView);

import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { View, Image, TouchableHighlight, PixelRatio, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

class adView extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        const { dispatch, adState } = this.props;
        dispatch({
            type: 'ad/countdownStart',
            payload: { tick: 1000, count: adState.tickCount }
        });
    }

    render() {
        const { adState, dispatch } = this.props;
        return (
            <View>
                <View>
                    <Image source={require('./../../../resource/ad.png')} />
                </View>
                <TouchableHighlight onPress={() => { Actions.home(); }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 40, right: 40, width: 50, height: 50, borderRadius: 300 / PixelRatio.get(), borderWidth: 2, backgroundColor: 'rgba(182,182,182,0.5)' }}>
                        <Text>跳过</Text>
                        <Text>{adState.tickCount > 0 ? adState.tickCount : ""}</Text>
                    </View>
                </TouchableHighlight>
            </View >
        );
    }
}

adView.propTypes = {
};

const mapStateToProps = (state) => {
    return {
        adState: state.ad,
    };
};
export default connect(mapStateToProps)(adView);

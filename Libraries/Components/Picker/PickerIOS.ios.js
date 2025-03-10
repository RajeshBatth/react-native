/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

// This is a controlled component version of RCTPickerIOS.

'use strict';

const RCTPickerNativeComponent = require('./RCTPickerNativeComponent');
const React = require('react');
const StyleSheet = require('../../StyleSheet/StyleSheet');
const View = require('../View/View');

const processColor = require('../../StyleSheet/processColor');

import type {TextStyleProp} from '../../StyleSheet/StyleSheet';
import type {ColorValue} from '../../StyleSheet/StyleSheetTypes';
import type {SyntheticEvent} from '../../Types/CoreEventTypes';
import type {ViewProps} from '../View/ViewPropTypes';

type PickerIOSChangeEvent = SyntheticEvent<
  $ReadOnly<{|
    newValue: number | string,
    newIndex: number,
  |}>,
>;

type RCTPickerIOSItemType = $ReadOnly<{|
  label: ?Label,
  value: ?(number | string),
  textColor: ?number,
|}>;

type Label = Stringish | number;

type Props = $ReadOnly<{|
  ...ViewProps,
  children: React.ChildrenArray<React.Element<typeof PickerIOSItem>>,
  itemStyle?: ?TextStyleProp,
  onChange?: ?(event: PickerIOSChangeEvent) => mixed,
  onValueChange?: ?(itemValue: string | number, itemIndex: number) => mixed,
  selectedValue: ?(number | string),
|}>;

type State = {|
  selectedIndex: number,
  items: $ReadOnlyArray<RCTPickerIOSItemType>,
|};

type ItemProps = $ReadOnly<{|
  label: ?Label,
  value?: ?(number | string),
  color?: ?ColorValue,
|}>;

const PickerIOSItem = (props: ItemProps): null => {
  return null;
};

class PickerIOS extends React.Component<Props, State> {
  _picker: ?React.ElementRef<typeof RCTPickerNativeComponent> = null;
  _lastNativeValue: ?number;

  state: State = {
    selectedIndex: 0,
    items: [],
  };

  static Item: (props: ItemProps) => null = PickerIOSItem;

  static getDerivedStateFromProps(props: Props): State {
    let selectedIndex = 0;
    const items = [];
    React.Children.toArray(props.children)
      .filter(child => child !== null)
      .forEach(function(child, index) {
        if (child.props.value === props.selectedValue) {
          selectedIndex = index;
        }
        items.push({
          value: child.props.value,
          label: child.props.label,
          textColor: processColor(child.props.color),
        });
      });
    return {selectedIndex, items};
  }

  render(): React.Node {
    return (
      <View style={this.props.style}>
        <RCTPickerNativeComponent
          ref={picker => {
            this._picker = picker;
          }}
          testID={this.props.testID}
          style={[styles.pickerIOS, this.props.itemStyle]}
          items={this.state.items}
          selectedIndex={this.state.selectedIndex}
          onChange={this._onChange}
        />
      </View>
    );
  }

  componentDidUpdate() {
    // This is necessary in case native updates the picker and JS decides
    // that the update should be ignored and we should stick with the value
    // that we have in JS.
    if (
      this._picker &&
      this._picker.setNativeProps &&
      this._lastNativeValue !== this.state.selectedIndex
    ) {
      this._picker.setNativeProps({
        selectedIndex: this.state.selectedIndex,
      });
    }
  }

  _onChange = event => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onValueChange) {
      this.props.onValueChange(
        event.nativeEvent.newValue,
        event.nativeEvent.newIndex,
      );
    }

    this._lastNativeValue = event.nativeEvent.newIndex;
    this.forceUpdate();
  };
}

const styles = StyleSheet.create({
  pickerIOS: {
    // The picker will conform to whatever width is given, but we do
    // have to set the component's height explicitly on the
    // surrounding view to ensure it gets rendered.
    height: 216,
  },
});

module.exports = PickerIOS;

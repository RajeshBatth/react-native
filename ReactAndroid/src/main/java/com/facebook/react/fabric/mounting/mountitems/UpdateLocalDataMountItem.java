/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.fabric.mounting.mountitems;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.fabric.mounting.MountingManager;

public class UpdateLocalDataMountItem implements MountItem {

  private final int mReactTag;
  @NonNull private final ReadableMap mNewLocalData;

  public UpdateLocalDataMountItem(int reactTag, @NonNull ReadableMap newLocalData) {
    mReactTag = reactTag;
    mNewLocalData = newLocalData;
  }

  @Override
  public void execute(@NonNull MountingManager mountingManager) {
    mountingManager.updateLocalData(mReactTag, mNewLocalData);
  }

  public @NonNull ReadableMap getNewLocalData() {
    return mNewLocalData;
  }

  @Override
  public String toString() {
    return "UpdateLocalDataMountItem [" + mReactTag + "]";
  }
}

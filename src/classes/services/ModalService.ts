import { shallowRef,ShallowRef, computed } from 'vue'

import type{ ModalConfig } from '@/types/classes/ModalConfig'

export class ModalService {
  private _isVisible: ShallowRef<boolean>
  private _config: ShallowRef<ModalConfig> | ShallowRef<null>

  constructor() {
    this._config = shallowRef(null)
    this._isVisible = shallowRef(false)
  }

  open(config: ModalConfig) {
    this._isVisible.value = true
    this._config.value = config
  }

  close() {
    this._isVisible.value = false
    this._config.value = null
  }

  get modalConfig() {
    return computed(() => this._config.value)
  }

  get isVisible() {
    return computed(() => this._isVisible.value)
  }
}

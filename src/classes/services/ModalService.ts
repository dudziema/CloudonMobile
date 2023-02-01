import { shallowRef,ShallowRef, Ref, ref, computed } from 'vue'
import ModalConfig from '@/types/ModalConfig'

export class ModalService {
  private _isVisible: Ref<boolean>
  private _config: ShallowRef<ModalConfig> | ShallowRef<null>
  constructor() {
    this._config = shallowRef(null)
    this._isVisible = ref(false)
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

type CapaStoreListener = () => void

class CapaStore {
  private capaActions: any[] = []
  private listeners: CapaStoreListener[] = []

  getAll() {
    return [...this.capaActions]
  }

  add(capa: any) {
    this.capaActions = [capa, ...this.capaActions]
    this.notifyListeners()
  }

  update(id: string, updates: any) {
    this.capaActions = this.capaActions.map((capa) => (capa.id === id ? { ...capa, ...updates } : capa))
    this.notifyListeners()
  }

  getBySourceRecord(sourceRecordId: string) {
    return this.capaActions.filter((capa) => capa.sourceRecordId === sourceRecordId)
  }

  subscribe(listener: CapaStoreListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  // Initialize with mock data
  init(mockData: any[]) {
    if (this.capaActions.length === 0) {
      this.capaActions = mockData
    }
  }
}

export const capaStore = new CapaStore()

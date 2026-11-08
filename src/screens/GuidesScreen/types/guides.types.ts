export interface GuidePhase {
  key: 'beforeSteps' | 'duringSteps' | 'afterSteps'
  cls: 'before' | 'during' | 'after'
  title: string
}

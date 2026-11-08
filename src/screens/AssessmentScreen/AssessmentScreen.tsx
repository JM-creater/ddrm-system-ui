import { ErrorState, Loading } from '../../components/ui/ui'
import Questionnaire from './components/Questionnaire'
import Results from './components/Results'
import './css/AssessmentScreen.css'
import { useAssessment } from './hooks/useAssessment'

export default function AssessmentScreen() {
  const { data, loading, error, reload, setData, editing, setEditing } = useAssessment()

  if (loading && !data) return <Loading />
  if (error || !data) return <ErrorState message={error ?? 'No data.'} onRetry={reload} />

  const { form, mine } = data

  if (mine.submitted && !editing) {
    return <Results form={form} mine={mine} onRetake={() => setEditing(true)} />
  }

  return (
    <Questionnaire
      form={form}
      previous={mine.submitted ? mine : null}
      onCancel={mine.submitted ? () => setEditing(false) : undefined}
      onDone={(result) => {
        setData({ form, mine: result })
        setEditing(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    />
  )
}

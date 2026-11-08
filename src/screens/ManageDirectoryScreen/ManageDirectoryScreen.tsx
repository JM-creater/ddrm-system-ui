import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button, Form, Tab, Table, Tabs } from 'react-bootstrap'
import { EmptyState, ErrorState, Loading, PageHeader, Panel } from '../../components/ui/ui'
import CenterEditor from './components/CenterEditor'
import HotlineEditor from './components/HotlineEditor'
import { EMPTY_CENTER, EMPTY_HOTLINE } from './constants/manageDirectory.constants'
import './css/ManageDirectoryScreen.css'
import { useManageDirectory } from './hooks/useManageDirectory'

export default function ManageDirectoryScreen() {
  const {
    data,
    loading,
    error,
    reload,
    setData,
    center,
    setCenter,
    hotline,
    setHotline,
    busy,
    toggleOpen,
    removeCenter,
    removeHotline,
  } = useManageDirectory()

  if (loading && !data) return <Loading />
  if (error || !data) return <ErrorState message={error ?? 'No data.'} onRetry={reload} />

  return (
    <>
      <PageHeader icon="🏠" title="Evacuation & Hotlines" subtitle="Evacuation centers and emergency hotlines shown to residents." />
      <Tabs defaultActiveKey="centers" className="mb-3">
        <Tab eventKey="centers" title={`Evacuation centers (${data.centers.length})`}>
          <Panel
            bodyClass=""
            title="Evacuation centers"
            actions={
              <Button size="sm" variant="accent" onClick={() => setCenter({ ...EMPTY_CENTER })}>
                <Plus size={15} className="me-1" /> Add center
              </Button>
            }
          >
            {data.centers.length === 0 ? (
              <EmptyState title="No evacuation centers yet" />
            ) : (
              <div className="table-responsive">
                <Table className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Name / location</th>
                      <th>Puroks served</th>
                      <th className="text-end">Capacity</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.centers.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div className="fw-semibold">{c.name}</div>
                          <div className="small text-muted">{c.location}</div>
                        </td>
                        <td className="small">{c.puroksServed || '—'}</td>
                        <td className="text-end tabular">{c.capacity ?? '—'}</td>
                        <td className="small">
                          {c.contactPerson || '—'}
                          {c.contactNumber && <div className="text-muted">{c.contactNumber}</div>}
                        </td>
                        <td>
                          <Form.Check
                            type="switch"
                            id={`open-${c.id}`}
                            label={c.open ? 'Open' : 'Closed'}
                            checked={c.open}
                            disabled={busy === `c${c.id}`}
                            onChange={() => toggleOpen(c)}
                          />
                        </td>
                        <td className="text-end text-nowrap">
                          <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => setCenter(c)} aria-label="Edit">
                            <Pencil size={14} />
                          </Button>
                          <Button size="sm" variant="outline-danger" onClick={() => removeCenter(c)} aria-label="Remove">
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Panel>
        </Tab>
        <Tab eventKey="hotlines" title={`Hotlines (${data.hotlines.length})`}>
          <Panel
            bodyClass=""
            title="Emergency hotlines"
            actions={
              <Button
                size="sm"
                variant="accent"
                onClick={() => setHotline({ ...EMPTY_HOTLINE, sortOrder: data.hotlines.length + 1 })}
              >
                <Plus size={15} className="me-1" /> Add hotline
              </Button>
            }
          >
            {data.hotlines.length === 0 ? (
              <EmptyState title="No hotlines yet" />
            ) : (
              <div className="table-responsive">
                <Table className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>Order</th>
                      <th>Agency</th>
                      <th>Number</th>
                      <th>Description</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.hotlines.map((h) => (
                      <tr key={h.id}>
                        <td className="tabular text-muted">{h.sortOrder}</td>
                        <td className="fw-semibold">{h.agency}</td>
                        <td className="tabular text-nowrap">{h.number}</td>
                        <td className="small text-muted">{h.description || '—'}</td>
                        <td className="text-end text-nowrap">
                          <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => setHotline(h)} aria-label="Edit">
                            <Pencil size={14} />
                          </Button>
                          <Button size="sm" variant="outline-danger" onClick={() => removeHotline(h)} aria-label="Remove">
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Panel>
        </Tab>
      </Tabs>

      {center && (
        <CenterEditor
          center={center}
          onClose={() => setCenter(null)}
          onSaved={(c) => {
            setCenter(null)
            setData((d) => d && { ...d, centers: center.id ? d.centers.map((x) => (x.id === c.id ? c : x)) : [...d.centers, c] })
          }}
        />
      )}
      {hotline && (
        <HotlineEditor
          hotline={hotline}
          onClose={() => setHotline(null)}
          onSaved={(h) => {
            setHotline(null)
            setData(
              (d) =>
                d && {
                  ...d,
                  hotlines: [...d.hotlines.filter((x) => x.id !== h.id), h].sort(
                    (a, b) => a.sortOrder - b.sortOrder || (a.id ?? 0) - (b.id ?? 0),
                  ),
                },
            )
          }}
        />
      )}
    </>
  )
}

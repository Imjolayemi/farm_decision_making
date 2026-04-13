import React, { useState, useEffect } from 'react'
import { Users, MessageCircle, Share2, Plus, Tractor, ThumbsUp, Send, X } from 'lucide-react'
import { subscribeToPosts, addPost, likePost, getEquipment, addEquipment } from '../services/firebase'
import { useAuth } from '../context/AuthContext'

const categories = ['All', 'Tips', 'Alert', 'Question', 'Market']
const badgeColor = { Tips: 'badge-success', Alert: 'badge-danger', Question: 'badge-info', Market: 'badge-warning' }

const FALLBACK_POSTS = [
  { id: 'f1', author: 'Chukwuemeka A.', location: 'Enugu State', time: '2h ago', avatar: '👨🏿‍🌾',
    content: 'My maize yield this season was exceptional after applying potassium sulphate. Split fertilizer application really helped reduce burning.',
    likes: 34, comments: 12, category: 'Tips' },
  { id: 'f2', author: 'Fatima Ibrahim', location: 'Kaduna State', time: '5h ago', avatar: '👩🏾‍🌾',
    content: 'Cassava mosaic disease spreading fast in my area. FarmWise AI detected it early — treating with insecticide now!',
    likes: 89, comments: 27, category: 'Alert' },
  { id: 'f3', author: 'Biodun Okafor', location: 'Ogun State', time: '1d ago', avatar: '🧑🏾‍🌾',
    content: 'Anyone used drip irrigation for tomatoes in dry season? Looking for suppliers around Abeokuta.',
    likes: 21, comments: 8, category: 'Question' },
]

const FALLBACK_EQUIPMENT = [
  { name: 'John Deere Tractor', daily: '₦25,000', available: true,  owner: 'Musa Garba',    icon: '🚜' },
  { name: 'Water Pump (2HP)',   daily: '₦5,000',  available: true,  owner: 'Tunde Adeyemi', icon: '💧' },
  { name: 'Threshing Machine',  daily: '₦18,000', available: false, owner: 'Grace Obi',     icon: '⚙️' },
  { name: 'Motorised Sprayer',  daily: '₦8,000',  available: true,  owner: 'Ahmed Sule',    icon: '🌿' },
]

export default function Community() {
  const { user } = useAuth()
  const [tab,       setTab]       = useState('feed')
  const [filter,    setFilter]    = useState('All')
  const [posts,     setPosts]     = useState(FALLBACK_POSTS)
  const [equipment, setEquipment] = useState(FALLBACK_EQUIPMENT)
  const [liked,     setLiked]     = useState({})
  const [showForm,  setShowForm]  = useState(false)
  const [newPost,   setNewPost]   = useState({ content: '', category: 'Tips', location: '' })
  const [posting,   setPosting]   = useState(false)

  // Live Firestore subscription
  useEffect(() => {
    try {
      const unsub = subscribeToPosts((livePosts) => {
        if (livePosts.length > 0) setPosts(livePosts)
      })
      return unsub
    } catch { /* Firebase not configured yet — use fallback */ }
  }, [])

  // Load equipment
  useEffect(() => {
    getEquipment()
      .then(eq => { if (eq.length > 0) setEquipment(eq) })
      .catch(() => {})
  }, [])

  const handleLike = async (postId) => {
    setLiked(l => ({ ...l, [postId]: !l[postId] }))
    try { await likePost(postId) } catch { /* offline */ }
  }

  const handlePost = async () => {
    if (!newPost.content.trim()) return
    setPosting(true)
    try {
      await addPost({
        content:  newPost.content,
        category: newPost.category,
        location: newPost.location || 'Nigeria',
        author:   user?.displayName || 'Anonymous Farmer',
        avatar:   '👨🏿‍🌾',
        comments: 0,
        likes:    0,
        time:     'Just now',
      })
      setNewPost({ content: '', category: 'Tips', location: '' })
      setShowForm(false)
    } catch {
      // Optimistic local update
      setPosts(p => [{ id: Date.now(), ...newPost, author: 'You', avatar: '👨🏿‍🌾', likes: 0, comments: 0, time: 'Just now', location: newPost.location || 'Nigeria' }, ...p])
      setNewPost({ content: '', category: 'Tips', location: '' })
      setShowForm(false)
    } finally {
      setPosting(false)
    }
  }

  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter)

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <div className="icon-box icon-box-teal"><Users size={20} /></div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 800, color: 'var(--clr-text)' }}>Farm Community</h2>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>Connect, share knowledge, and rent equipment.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', background: 'var(--clr-bg-card)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }}>
        {[{ key: 'feed', label: '📰 Feed' }, { key: 'equipment', label: '🚜 Equipment' }].map(t => (
          <button key={t.key} id={`tab-${t.key}`} onClick={() => setTab(t.key)}
            style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: tab === t.key ? 'var(--grad-primary)' : 'transparent',
              color: tab === t.key ? '#fff' : 'var(--clr-text-muted)',
              fontSize: '0.82rem', fontWeight: 700, transition: 'var(--transition)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'feed' && (
        <>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.3rem', marginBottom: '1rem' }}>
            {categories.map(c => (
              <button key={c} id={`filter-${c.toLowerCase()}`} onClick={() => setFilter(c)}
                style={{ padding: '0.35rem 0.85rem', borderRadius: 999,
                  border: `1.5px solid ${filter === c ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                  background: filter === c ? 'rgba(26,122,74,0.18)' : 'transparent',
                  color: filter === c ? 'var(--clr-primary-light)' : 'var(--clr-text-muted)',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition)' }}>
                {c}
              </button>
            ))}
          </div>

          {/* New post form */}
          {showForm && (
            <div className="glass-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--clr-text)' }}>Share with Farmers</p>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)' }}><X size={16} /></button>
              </div>
              <textarea id="post-content" className="form-input" rows={3} placeholder="What's happening on your farm..."
                style={{ width: '100%', resize: 'none', marginBottom: '0.6rem' }}
                value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <select id="post-category" className="form-select"
                  value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}>
                  {['Tips', 'Alert', 'Question', 'Market'].map(c => <option key={c}>{c}</option>)}
                </select>
                <input id="post-location" className="form-input" placeholder="Your state..." 
                  value={newPost.location} onChange={e => setNewPost(p => ({ ...p, location: e.target.value }))} />
              </div>
              <button id="submit-post-btn" className="btn-primary" onClick={handlePost} disabled={posting || !newPost.content.trim()}>
                <Send size={14} /> {posting ? 'Posting...' : 'Post Update'}
              </button>
            </div>
          )}

          {/* Posts list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {filtered.map(p => (
              <div key={p.id} className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{p.avatar || '👨🏿‍🌾'}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--clr-text)' }}>{p.author}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>{p.location} · {p.time}</p>
                  </div>
                  {p.category && <span className={`badge ${badgeColor[p.category] || 'badge-info'}`}>{p.category}</span>}
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--clr-text)', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.content}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button id={`like-${p.id}`} onClick={() => handleLike(p.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer',
                      color: liked[p.id] ? 'var(--clr-primary-light)' : 'var(--clr-text-muted)', fontSize: '0.78rem', fontWeight: 600, transition: 'var(--transition)' }}>
                    <ThumbsUp size={14} fill={liked[p.id] ? 'var(--clr-primary-light)' : 'none'} />
                    {(p.likes || 0) + (liked[p.id] ? 1 : 0)}
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
                    <MessageCircle size={14} /> {p.comments || 0}
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)', fontSize: '0.78rem', fontWeight: 600, marginLeft: 'auto' }}>
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!showForm && (
            <button id="new-post-btn" className="btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Share a Farm Update
            </button>
          )}
        </>
      )}

      {tab === 'equipment' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {equipment.map((eq, i) => (
              <div key={i} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '2rem' }}>{eq.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 3 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--clr-text)' }}>{eq.name}</p>
                    <span className={`badge ${eq.available ? 'badge-success' : 'badge-danger'}`}>
                      {eq.available ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>Owner: {eq.owner}</p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--clr-secondary)', marginTop: 3 }}>{eq.daily}/day</p>
                </div>
                <button id={`rent-${i}`} disabled={!eq.available}
                  style={{ padding: '0.5rem 0.85rem', borderRadius: 10, border: 'none',
                    cursor: eq.available ? 'pointer' : 'not-allowed',
                    background: eq.available ? 'var(--grad-primary)' : 'var(--clr-bg-surface)',
                    color: eq.available ? '#fff' : 'var(--clr-text-dim)', fontSize: '0.75rem', fontWeight: 700, transition: 'var(--transition)' }}>
                  {eq.available ? 'Rent' : 'Unavailable'}
                </button>
              </div>
            ))}
          </div>
          <button id="list-equipment-btn" className="btn-secondary">
            <Tractor size={16} /> List Your Equipment
          </button>
        </>
      )}
    </div>
  )
}

import React from 'react'
import type { CastMember } from '../../types/movie'
import './CastList.css'

interface CastListProps {
  casts: CastMember[]
}

export const CastList: React.FC<CastListProps> = ({ casts }) => {
  if (!casts || casts.length === 0) return null

  return (
    <section className="cast-section">
      <h2 className="section-title">DIỄN VIÊN</h2>

      <div className="cast-list-row">
        {casts.map((actor, idx) => (
          <div key={actor.person_id || idx} className="cast-card">
            <div className="cast-avatar-wrapper">
              <img
                src={actor.profile_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=22293d&color=fff`}
                alt={actor.name}
                className="cast-avatar-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=22293d&color=fff`
                }}
              />
            </div>
            <div className="cast-info">
              <span className="cast-name" title={actor.name}>
                {actor.name}
              </span>
              {actor.character_name && (
                <span className="cast-character" title={actor.character_name}>
                  {actor.character_name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

<template>
  <div class="about">

    <!-- ── Project header ── -->
    <div class="about-header">
      <p class="about-tag">◈ ACADEMIC PROJECT</p>
      <h1 class="about-title">About SmartRent</h1>
      <p class="about-sub">
        Smart Vehicle Rental Management System — ISS Project<br />
        South Mediterranean University · MedTech
      </p>
    </div>

    <!-- ── Project description ── -->
    <div class="about-card">
      <p class="card-label">THE PROJECT</p>
      <p class="about-text">
        SmartRent is a full-stack vehicle rental platform developed as part of the ISS
        (Ingénierie des Systèmes et des Services) curriculum. It demonstrates real-world
        software engineering concepts including REST API design, JWT authentication,
        role-based access control, and a reactive frontend connected to a Spring Boot backend.
      </p>
      <p class="about-text">
        The system supports two rental models: instant self-service rentals billed per minute,
        and admin-approved contract rentals billed per day with optional vehicle delivery.
      </p>
    </div>

    <!-- ── Tech stack ── -->
    <div class="tech-section">
      <h2 class="section-title">Tech Stack</h2>
      <div class="tech-grid">
        <div class="tech-card" v-for="tech in techStack" :key="tech.name">
          <p class="tech-icon">{{ tech.icon }}</p>
          <p class="tech-name">{{ tech.name }}</p>
          <p class="tech-desc">{{ tech.desc }}</p>
        </div>
      </div>
    </div>

    <!-- ── Team ── -->
    <div class="team-section">
      <h2 class="section-title">The Team</h2>
      <div class="team-grid">
        <div class="team-card" v-for="member in team" :key="member.name">
          <!-- Avatar with initials -->
          <div class="member-avatar">{{ member.initials }}</div>
          <h3 class="member-name">{{ member.name }}</h3>
          <p class="member-role">{{ member.role }}</p>
        </div>
      </div>
    </div>

    <!-- ── University info ── -->
    <div class="university-card">
      <p class="card-label">INSTITUTION</p>
      <p class="uni-name">South Mediterranean University — MedTech</p>
      <p class="uni-program">Program: ISS — Ingénierie des Systèmes et des Services</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AboutView',

  data() {
    return {
      // Tech stack used in the project
      techStack: [
        { icon: '☕', name: 'Spring Boot',  desc: 'Java backend with REST API' },
        { icon: '💚', name: 'Vue 3',        desc: 'Reactive frontend with Vite' },
        { icon: '🐬', name: 'MySQL',        desc: 'Relational database with JPA' },
        { icon: '🔐', name: 'JWT',          desc: 'Stateless authentication tokens' },
        { icon: '📡', name: 'Axios',        desc: 'HTTP client for API calls' },
        { icon: '🐳', name: 'Docker',       desc: 'Containerized deployment' }
      ],

      // Team members
      team: [
        { name: 'Karim Masmoudi', initials: 'KM', role: 'Full Stack Developer' },
        { name: 'Bilel Didi',     initials: 'BD', role: 'Full Stack Developer' },
        { name: 'Aziz Zemzmi',    initials: 'AZ', role: 'Full Stack Developer' },
        { name: 'Ahmed Tahri',    initials: 'AT', role: 'Full Stack Developer' }
      ]
    }
  }
}
</script>

<style scoped>
.about { display: flex; flex-direction: column; gap: 40px; }

/* Header */
.about-header { text-align: center; padding: 40px 0 20px; }
.about-tag { color: #3b82f6; font-size: 12px; letter-spacing: 3px; margin-bottom: 12px; }
.about-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 44px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 2px;
}
.about-sub { color: #475569; font-size: 14px; margin-top: 10px; line-height: 1.7; }

/* Description card */
.about-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card-label { color: #3b82f6; font-size: 11px; letter-spacing: 3px; }
.about-text { color: #94a3b8; font-size: 14px; line-height: 1.8; }

/* Tech stack */
.tech-section { display: flex; flex-direction: column; gap: 20px; }
.section-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 2px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.tech-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.2s;
}
.tech-card:hover { border-color: #2a4a7f; }

.tech-icon { font-size: 28px; }
.tech-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}
.tech-desc { color: #475569; font-size: 12px; }

/* Team */
.team-section { display: flex; flex-direction: column; gap: 20px; }

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.team-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  transition: border-color 0.2s;
}
.team-card:hover { border-color: #2a4a7f; }

/* Avatar circle with initials */
.member-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #0f1a2e;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  font-family: 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}
.member-role { color: #475569; font-size: 12px; }

/* University card */
.university-card {
  background: #13161e;
  border: 1px solid #1e3a5f;
  border-radius: 8px;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uni-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}
.uni-program { color: #475569; font-size: 13px; }
</style>

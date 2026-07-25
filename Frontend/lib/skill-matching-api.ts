// Skill Matching API service
const API_BASE_URL = 'http://localhost:8000';

// Types for skill matching
export interface SkillMatch {
  internship_id: string;
  title: string;
  company_name: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  duration_weeks: number;
  stipend: number;
  work_type: string;
  location: string;
  application_deadline: string;
  start_date: string;
  end_date: string;
  difficulty_level: string;
  benefits: string[];
  match_score: number;
  student_skills: string[];
  student_name: string;
}

export interface CandidateMatch {
  application_id: string;
  student_email: string;
  student_name: string;
  student_skills: string[];
  cover_letter: string;
  resume_url: string;
  portfolio_url: string;
  github_url: string;
  motivation: string;
  relevant_experience: string;
  applied_date: string;
  status: string;
  match_score: number;
  internship_required_skills: string[];
  internship_preferred_skills: string[];
  academic_year: string;
  department: string;
}

class SkillMatchingAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem('sb:access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Student skill matching endpoints
  async getStudentMatches(studentEmail: string): Promise<SkillMatch[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/skill-matching/student/matches/${studentEmail}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch skill matches: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching student skill matches:', error);
      throw error;
    }
  }

  // HR skill matching endpoints
  async getInternshipCandidateMatches(internshipId: string): Promise<CandidateMatch[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/skill-matching/hr/internship-matches/${internshipId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch candidate matches: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching candidate matches:', error);
      throw error;
    }
  }
}

export const skillMatchingAPI = new SkillMatchingAPI();

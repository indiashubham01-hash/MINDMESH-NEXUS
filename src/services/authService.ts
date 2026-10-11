/**
 * MINDMESH-NEXUS Authentication & OTP Service
 * Manages user registration, login, and instant Dummy OTP verification.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'teacher' | 'student';
  usn?: string;
  university?: string;
  department?: string;
  isVerified: boolean;
  avatarUrl?: string;
  grade?: number;
  subject?: string;
  preferredLanguage?: 'English' | 'Hindi' | 'Kannada' | 'Bilingual';
  createdAt: string;
}

export interface OtpRecord {
  phone: string;
  otp: string;
  expiresAt: number;
  purpose: 'register' | 'login';
}

const STORAGE_USERS_KEY = 'mindmesh_nexus_registered_users_v3';
const STORAGE_CURRENT_USER_KEY = 'mindmesh_nexus_current_auth_user_v3';

// Seed initial demo users with USN, University, and Department
const INITIAL_DEMO_USERS: AuthUser[] = [
  {
    id: 'usr-student-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@student.edu.in',
    phone: '+91 91234 56789',
    usn: '1MS21CS045',
    university: 'Visvesvaraya Technological University (VTU)',
    role: 'student',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    grade: 7,
    preferredLanguage: 'English',
    createdAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'usr-student-2',
    name: 'Prajwal Gowda',
    email: 'prajwal.gowda@bengaluru.edu.in',
    phone: '+91 99887 76655',
    usn: '1RV22CS102',
    university: 'RV College of Engineering / VTU',
    role: 'student',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    grade: 7,
    preferredLanguage: 'Kannada',
    createdAt: '2026-09-12T11:00:00Z'
  },
  {
    id: 'usr-teacher-1',
    name: 'Dr. Aditi Sharma',
    email: 'aditi.sharma@delhischool.edu.in',
    phone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
    role: 'teacher',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    subject: 'Computer Science & Engineering',
    preferredLanguage: 'English',
    createdAt: '2026-09-01T08:00:00Z'
  }
];

class AuthService {
  private activeOtps: Map<string, OtpRecord> = new Map();

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(STORAGE_USERS_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
    } else {
      try {
        const users: AuthUser[] = JSON.parse(existing);
        let updated = false;
        users.forEach(u => {
          if (u.id === 'usr-student-1' && u.preferredLanguage === 'Hindi') {
            u.preferredLanguage = 'English';
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
        }
      } catch (e) {}
    }
  }

  public getUsers(): AuthUser[] {
    if (typeof window === 'undefined') return INITIAL_DEMO_USERS;
    const data = localStorage.getItem(STORAGE_USERS_KEY);
    return data ? JSON.parse(data) : INITIAL_DEMO_USERS;
  }

  public saveUsers(users: AuthUser[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  public updateUserLanguage(userId: string, lang: 'English' | 'Hindi' | 'Kannada' | 'Bilingual') {
    const users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.preferredLanguage = lang;
      this.saveUsers(users);
    }
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      current.preferredLanguage = lang;
      this.setCurrentUser(current);
    }
  }

  public normalizePhone(phone: string): string {
    const digits = (phone || '').replace(/\D/g, '');
    if (digits.length === 10) return '91' + digits;
    if (digits.length === 12 && digits.startsWith('91')) return digits;
    return digits || '919123456789';
  }

  /**
   * Generates a deterministic, standard 6-digit dummy OTP (123456 for instant demo confirmation).
   */
  public generateDeterministicOtp(_phone?: string): string {
    return '123456';
  }

  /**
   * Generates the 6-digit Dummy OTP and constructs the WhatsApp Deep Link.
   */
  public generateAndSendWhatsAppOtp(
    phone: string,
    userName: string,
    purpose: 'register' | 'login'
  ): { otp: string; whatsappUrl: string } {
    const cleanPhone = this.normalizePhone(phone);
    const otp = '123456';
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    this.activeOtps.set(cleanPhone, {
      phone: cleanPhone,
      otp,
      expiresAt,
      purpose
    });

    const purposeText = purpose === 'register' ? 'account registration' : 'secure login verification';
    const message = `🌟 *MINDMESH-NEXUS Security OTP*\n\nHello ${userName || 'User'},\nYour 6-digit WhatsApp verification OTP for ${purposeText} is: *${otp}*\n\nThis OTP is valid for 15 minutes. Use code 123456 to confirm.`;
    
    // Construct WhatsApp Deep Link URL
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${digitsOnly}&text=${encodeURIComponent(message)}`;

    return { otp, whatsappUrl };
  }

  /**
   * Verify the entered Dummy OTP
   */
  public verifyOtp(phone: string, enteredOtp: string): { success: boolean; message: string } {
    const cleanPhone = this.normalizePhone(phone);
    const trimmedOtp = (enteredOtp || '').trim();

    if (!trimmedOtp || trimmedOtp.length < 6) {
      return { success: false, message: 'Please enter all 6 digits of the OTP (e.g. 123456).' };
    }

    // Always accept 123456 or any 6-digit code for dummy OTP verification
    const record = this.activeOtps.get(cleanPhone);
    if (trimmedOtp === '123456' || (record && record.otp === trimmedOtp) || trimmedOtp.length === 6) {
      if (record) this.activeOtps.delete(cleanPhone);
      return { success: true, message: 'OTP verified successfully.' };
    }

    return { success: false, message: 'Incorrect OTP. Use dummy code 123456 or click Auto-Fill.' };
  }

  /**
   * Register a new user without password
   */
  public registerUser(userData: {
    name: string;
    email?: string;
    phone: string;
    role: 'teacher' | 'student';
    usn?: string;
    university?: string;
    department?: string;
    preferredLanguage?: 'English' | 'Hindi' | 'Kannada' | 'Bilingual';
    grade?: number;
  }): { success: boolean; user?: AuthUser; message: string } {
    const users = this.getUsers();
    const cleanPhone = this.normalizePhone(userData.phone);

    // Check if phone or USN already registered
    const exists = users.find(
      u => this.normalizePhone(u.phone) === cleanPhone || 
           (userData.usn && u.usn && u.usn.toLowerCase() === userData.usn.trim().toLowerCase())
    );

    if (exists) {
      // Re-use or update existing user
      exists.name = userData.name || exists.name;
      exists.role = userData.role;
      if (userData.usn) exists.usn = userData.usn;
      if (userData.university) exists.university = userData.university;
      if (userData.department) exists.department = userData.department;
      if (userData.preferredLanguage) exists.preferredLanguage = userData.preferredLanguage;
      this.saveUsers(users);
      this.setCurrentUser(exists);
      return { success: true, user: exists, message: 'Welcome back! Logged in via OTP.' };
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email || `${userData.name.toLowerCase().replace(/\s+/g, '.')}@edu.in`,
      phone: cleanPhone,
      role: userData.role,
      usn: userData.usn,
      university: userData.university,
      department: userData.department,
      isVerified: true,
      avatarUrl: userData.role === 'teacher'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : (userData.preferredLanguage === 'Kannada' 
          ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'),
      grade: userData.grade || (userData.role === 'student' ? 7 : undefined),
      preferredLanguage: userData.preferredLanguage || 'English',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser, message: 'Registration and OTP verification successful!' };
  }

  /**
   * Validate user identifier before sending Dummy OTP (no password needed)
   */
  public validateLoginCredentials(
    identifier: string
  ): { success: boolean; user?: AuthUser; message: string } {
    const users = this.getUsers();
    const cleanIdentifier = this.normalizePhone(identifier);
    const queryLower = identifier.trim().toLowerCase();

    const user = users.find(
      u =>
        this.normalizePhone(u.phone) === cleanIdentifier ||
        u.email.toLowerCase() === queryLower ||
        (u.usn && u.usn.toLowerCase() === queryLower) ||
        u.name.toLowerCase() === queryLower
    );

    if (!user) {
      return { success: false, message: 'No registered account found with this phone number or USN.' };
    }

    return { success: true, user, message: 'Account identified. Proceeding to Dummy OTP verification.' };
  }

  public getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return INITIAL_DEMO_USERS[0];
    try {
      const data = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return INITIAL_DEMO_USERS[0];
  }

  public setCurrentUser(user: AuthUser | null) {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  }

  public logout() {
    this.setCurrentUser(null);
  }
}

export const authService = new AuthService();

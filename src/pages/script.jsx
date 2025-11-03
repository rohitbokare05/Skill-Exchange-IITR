import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const DUMMY_USERS = [
  {
    uid: 'dummy_user_1',
    name: 'Priya Sharma',
    email: 'priya.sharma@iitr.ac.in',
    skills: [
      {
        skillTag: 'Web Development',
        customMessage: 'Full-stack developer with 2 years experience. Can teach React, Node.js, and MongoDB.',
        addedAt: '2024-10-15T10:30:00.000Z'
      },
      {
        skillTag: 'Data Structures',
        customMessage: 'Competitive programmer. Can help with DSA concepts and problem-solving.',
        addedAt: '2024-10-20T14:20:00.000Z'
      }
    ],
    ratingSum: 22,
    ratingCount: 5,
    createdAt: '2024-10-10T08:00:00.000Z',
    updatedAt: '2024-10-20T14:20:00.000Z'
  },
  {
    uid: 'dummy_user_2',
    name: 'Rahul Verma',
    email: 'rahul.verma@iitr.ac.in',
    skills: [
      {
        skillTag: 'Machine Learning',
        customMessage: 'ML enthusiast. Working on computer vision projects. Can teach Python, TensorFlow, and PyTorch.',
        addedAt: '2024-10-12T09:15:00.000Z'
      },
      {
        skillTag: 'Python Programming',
        customMessage: 'Python expert for 3+ years. Can help with automation, data analysis, and scripting.',
        addedAt: '2024-10-18T11:45:00.000Z'
      }
    ],
    ratingSum: 19,
    ratingCount: 4,
    createdAt: '2024-10-08T07:30:00.000Z',
    updatedAt: '2024-10-18T11:45:00.000Z'
  },
  {
    uid: 'dummy_user_3',
    name: 'Ananya Patel',
    email: 'ananya.patel@iitr.ac.in',
    skills: [
      {
        skillTag: 'UI/UX Design',
        customMessage: 'Passionate about creating beautiful user experiences. Proficient in Figma and Adobe XD.',
        addedAt: '2024-10-14T13:00:00.000Z'
      },
      {
        skillTag: 'Graphic Design',
        customMessage: 'Freelance graphic designer. Can teach Photoshop, Illustrator, and branding basics.',
        addedAt: '2024-10-22T16:30:00.000Z'
      }
    ],
    ratingSum: 24,
    ratingCount: 5,
    createdAt: '2024-10-05T09:00:00.000Z',
    updatedAt: '2024-10-22T16:30:00.000Z'
  },
  {
    uid: 'dummy_user_4',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@iitr.ac.in',
    skills: [
      {
        skillTag: 'Android Development',
        customMessage: 'Android developer with multiple apps on Play Store. Can teach Kotlin and Jetpack Compose.',
        addedAt: '2024-10-16T10:00:00.000Z'
      }
    ],
    ratingSum: 15,
    ratingCount: 3,
    createdAt: '2024-10-12T08:30:00.000Z',
    updatedAt: '2024-10-16T10:00:00.000Z'
  },
  {
    uid: 'dummy_user_5',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@iitr.ac.in',
    skills: [
      {
        skillTag: 'Content Writing',
        customMessage: 'Published writer and blogger. Can help with technical writing, SEO, and storytelling.',
        addedAt: '2024-10-19T15:20:00.000Z'
      },
      {
        skillTag: 'Digital Marketing',
        customMessage: 'Social media marketing intern. Know the ins and outs of Instagram, LinkedIn marketing.',
        addedAt: '2024-10-25T12:10:00.000Z'
      }
    ],
    ratingSum: 18,
    ratingCount: 4,
    createdAt: '2024-10-15T10:00:00.000Z',
    updatedAt: '2024-10-25T12:10:00.000Z'
  },
  {
    uid: 'dummy_user_6',
    name: 'Vikram Singh',
    email: 'vikram.singh@iitr.ac.in',
    skills: [
      {
        skillTag: 'Cybersecurity',
        customMessage: 'Ethical hacking enthusiast. Can teach network security, penetration testing basics.',
        addedAt: '2024-10-17T14:30:00.000Z'
      }
    ],
    ratingSum: 20,
    ratingCount: 4,
    createdAt: '2024-10-10T09:15:00.000Z',
    updatedAt: '2024-10-17T14:30:00.000Z'
  },
  {
    uid: 'dummy_user_7',
    name: 'Divya Gupta',
    email: 'divya.gupta@iitr.ac.in',
    skills: [
      {
        skillTag: 'Photography',
        customMessage: 'Campus photographer. Can teach DSLR basics, composition, and photo editing in Lightroom.',
        addedAt: '2024-10-21T11:00:00.000Z'
      },
      {
        skillTag: 'Video Editing',
        customMessage: 'YouTube content creator. Expert in Premiere Pro and DaVinci Resolve.',
        addedAt: '2024-10-26T13:45:00.000Z'
      }
    ],
    ratingSum: 0,
    ratingCount: 0,
    createdAt: '2024-10-20T08:00:00.000Z',
    updatedAt: '2024-10-26T13:45:00.000Z'
  },
  {
    uid: 'dummy_user_8',
    name: 'Karan Joshi',
    email: 'karan.joshi@iitr.ac.in',
    skills: [
      {
        skillTag: 'Game Development',
        customMessage: 'Indie game developer. Can teach Unity, C#, and game design principles.',
        addedAt: '2024-10-23T10:30:00.000Z'
      }
    ],
    ratingSum: 21,
    ratingCount: 5,
    createdAt: '2024-10-18T07:45:00.000Z',
    updatedAt: '2024-10-23T10:30:00.000Z'
  }
];

export const addDummyUsersToFirestore = async () => {
  try {
    console.log('Starting to add dummy users...');
    
    for (const user of DUMMY_USERS) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, user);
      console.log(`✅ Added user: ${user.name}`);
    }
    
    console.log('🎉 All dummy users added successfully!');
    alert('Dummy users added successfully!');
  } catch (error) {
    console.error('Error adding dummy users:', error);
    alert('Failed to add dummy users: ' + error.message);
  }
};
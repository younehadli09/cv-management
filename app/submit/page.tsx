'use client';

import { useState } from 'react';
type FormData = {
  // ENTETE
  nom: string;
  prenom: string;
  dateNaissance: string;
  adresse: string;
  email: string;
  nationalite: string;
  situationMaritale: string;
  permis: string;
  photo: string;

  // OBJECTIF
  objectif: string;

  // FORMATIONS
  formations: {
    type: string;
    etablissement: string;
    de: string;
    a: string;
    text: string;
  }[];

  // STAGES
  stages: {
    intituleStage: string;
    dateStage: string;
    anneeStage: string;
    descriptionStage: string;
  }[];

  // EXPERIENCES PROFESSIONNELLES
  experiencesProfessionnelles: {
    poste: string;
    etablissementExp: string;
    deExp: string;
    aExp: string;
    descriptionExp: string;
    achievement: string[];
  }[];

  // COMPETENCES
  competences: {
    titre: string;
    description: string;
  }[];

  // LANGUES
  langues: {
    intitule: string;
    niveau: string;
  }[];

  // LOISIRS
  loisirs: string[];

  // REFERENCES
  emailReference: string;
  telephoneReference: string;
  nomReference: string;
  relationReference: string;
};

export default function SubmitCV() {
  const [mode, setMode] = useState<'form' | 'pdf' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    adresse: '',
    email: '',
    nationalite: '',
    situationMaritale: '',
    permis: '',
    photo: '',
    objectif: '',
    formations: [
      {
        type: '',
        etablissement: '',
        de: '',
        a: '',
        text: '',
      },
    ],
    stages: [
      {
        intituleStage: '',
        dateStage: '',
        anneeStage: '',
        descriptionStage: '',
      },
    ],
    experiencesProfessionnelles: [
      {
        poste: '',
        etablissementExp: '',
        deExp: '',
        aExp: '',
        descriptionExp: '',
        achievement: [''],
      },
    ],
    competences: [
      {
        titre: '',
        description: '',
      },
    ],
    langues: [
      {
        intitule: '',
        niveau: '',
      },
    ],
    loisirs: [''],
    emailReference: '',
    telephoneReference: '',
    nomReference: '',
    relationReference: '',
  });
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [response, setResponse] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: string,
    index?: number
  ) => {
    const { name, value } = e.target;
  
    if (section && index !== undefined) {
      const updatedSection = [...(formData[section as keyof FormData] as any[])];
      updatedSection[index] = { ...updatedSection[index], [name]: value };
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof Pick<FormData, 'formations' | 'stages' | 'experiencesProfessionnelles' | 'competences' | 'langues'>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedSection = [...(formData[section] as any[])];
    updatedSection[index] = { ...updatedSection[index], [name]: value };
    setFormData({ ...formData, [section]: updatedSection });
  };
  
  

  const getNewItem = (section: string) => {
    switch (section) {
      case 'formations':
        return { type: '', etablissement: '', de: '', a: '', text: '' };
      case 'stages':
        return { intituleStage: '', dateStage: '', anneeStage: '', descriptionStage: '' };
      case 'experiencesProfessionnelles':
        return { poste: '', etablissementExp: '', deExp: '', aExp: '', descriptionExp: '', achievement: [''] };
      case 'competences':
        return { titre: '', description: '' };
      case 'langues':
        return { intitule: '', niveau: '' };
      case 'loisirs':
        return '';
      default:
        return {};
    }
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, photo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setPhotoFile(file);
  //     setFormData({ ...formData, photo: file.name }); // Ou garde une URL/nom si tu stockes ça côté backend
  //   }
  // };

  
  const addItemToArray = (section: keyof FormData) => {
    const newItem = getNewItem(section);
    setFormData({ ...formData, [section]: [...(formData[section] as any[]), newItem] });
  };
  

  const removeItemFromArray = (section: keyof FormData, index: number) => {
    const updatedSection = (formData[section] as any[]).filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updatedSection });
  };
  
  const addAchievementToExperience = (index: number) => {
    const updatedExperiences = [...formData.experiencesProfessionnelles];
    updatedExperiences[index].achievement.push('');
    setFormData({ ...formData, experiencesProfessionnelles: updatedExperiences });
  };

  const removeAchievementFromExperience = (experienceIndex: number, achievementIndex: number) => {
    const updatedExperiences = [...formData.experiencesProfessionnelles];
    updatedExperiences[experienceIndex].achievement = updatedExperiences[experienceIndex].achievement.filter((_, i) => i !== achievementIndex);
    setFormData({ ...formData, experiencesProfessionnelles: updatedExperiences });
  };
 
  const handleFormSubmit = async () => {
    const jsonData = {
      entete: {
        nom: formData.nom,
        prenom: formData.prenom,
        dateNaissance: formData.dateNaissance,
        adresse: formData.adresse,
        nationalite: formData.nationalite,
        situationMaritale: formData.situationMaritale,
        permis: formData.permis,
        photo: formData.photo,
      },
      objectif: { __text: formData.objectif },
      parcours: {
        formations: { diplome: formData.formations },
        stages: { stage: formData.stages },
        experiencesProfessionnelles: { experience: formData.experiencesProfessionnelles },
      },
      competences: { competence: formData.competences },
      langues: { langue: formData.langues },
      loisirs: { loisir: formData.loisirs },
      references: {
        contact: [
          {
            _email: formData.emailReference,
            _telephone: formData.telephoneReference,
            nom: formData.nomReference,
            relation: formData.relationReference,
          },
        ],
      },
    };

    const res = await fetch('http://', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData),
    });

    const data = await res.json();
    setResponse(res.ok ? 'CV ajouté avec succès !' : `Erreur: ${data.details}`);
  };

  const handlePdfSubmit = async () => {
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append('file', pdfFile);

    const res = await fetch('http://localhost:5000/upload_pdf', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setResponse(res.ok ? 'PDF envoyé avec succès !' : `Erreur: ${data.details}`);
  };

  

  return (
    <div className="cv-container">
      <header className="cv-header">
        <h1>Mon CV</h1>
        <p>Sélectionnez un mode puis remplissez les champs</p>
      </header>

      {!mode ? (
        <div className="flex gap-4 mb-6">
          <button className="cv-button" onClick={() => setMode('form')}>Remplir le formulaire</button>
          <button className="cv-button-secondary" onClick={() => setMode('pdf')}>Télécharger un PDF</button>
        </div>
      ) : mode === 'form' ? (
        <>
          {/* ENTÊTE */}
{/* ENTÊTE */}
<section className="cv-section bg-gray-100 p-6 rounded-lg shadow-md mb-6">
  <h2 className="cv-section-title text-xl font-semibold text-gray-800">Informations Personnelles</h2>
  <div className="cv-flex mb-6">
    {/* Photo Field */}
    <div className="cv-photo w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
      <label htmlFor="photo" className="block mb-2 text-gray-700">Photo</label>
      <input
        id="photo"
        name="photo"
        type="file"
        accept="image/*"
        className="file-input w-full h-full object-cover"
        onChange={(e) => handlePhotoUpload(e)}
      />
    </div>
    {/* Personal Information Fields */}
    <div className="cv-info ml-6 w-full">
      <div className="cv-grid-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {['nom', 'prenom', 'dateNaissance', 'adresse', 'email', 'telephone', 'nationalite', 'situationMaritale', 'permis'].map((field) => (
          <div key={field} className="cv-field">
            <label htmlFor={field} className="text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              id={field}
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              className="input-field"
              value={(formData as any)[field] || ''}
              onChange={(e) => handleChange(e)}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


          {/* OBJECTIF */}
          <section className="cv-section">
            <h2 className="cv-section-title">Objectif</h2>
            <div className="cv-field">
              <label htmlFor="objectif">Objectif</label>
              <textarea
                id="objectif"
                name="objectif"
                value={formData.objectif}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </section>

         {/* FORMATIONS */}
    <section className="cv-section">
      <h2 className="cv-section-title">Formations</h2>
      {formData.formations.map((_, idx) => (
        <div key={idx} className="cv-grid-2">
          {['type', 'etablissement', 'de', 'a'].map((key) => (
            <div key={key} className="cv-field">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                name={key}
                value={(formData.formations[idx] as any)[key]}
                onChange={(e) => handleArrayChange(e, 'formations', idx)}
              />
            </div>
          ))}
          <div className="cv-field col-span-full">
            <label>Détails</label>
            <textarea
              name="text"
              value={formData.formations[idx].text}
              onChange={(e) => handleArrayChange(e, 'formations', idx)}
            />
          </div>
          {/* Delete Button */}
          <button type="button" onClick={() => removeItemFromArray('formations', idx)} className="text-red-500">
            ✖
          </button>
        </div>
      ))}
      <button className="cv-button-secondary" onClick={() => addItemToArray('formations')}>
        + Ajouter une formation
      </button>
    </section>

    {/* STAGES */}
    <section className="cv-section">
      <h2 className="cv-section-title">Stages</h2>
      {formData.stages.map((_, idx) => (
        <div key={idx} className="cv-grid-2">
          {['intituleStage', 'dateStage', 'anneeStage'].map((key) => (
            <div key={key} className="cv-field">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                name={key}
                value={(formData.stages[idx] as any)[key]}
                onChange={(e) => handleArrayChange(e, 'stages', idx)}
              />
            </div>
          ))}
          {/* Delete Button */}
          <button type="button" onClick={() => removeItemFromArray('stages', idx)} className="text-red-500">
            ✖
          </button>
        </div>
      ))}
      <button className="cv-button-secondary" onClick={() => addItemToArray('stages')}>
        + Ajouter un stage
      </button>
    </section>

    {/* EXPERIENCES PROFESSIONNELLES */}
    <section className="cv-section">
      <h2 className="cv-section-title">Expériences Professionnelles</h2>
      {formData.experiencesProfessionnelles.map((exp, idx) => (
        <div key={idx} className="cv-grid-2">
          {['poste', 'etablissementExp', 'deExp', 'aExp'].map((key) => (
            <div key={key} className="cv-field">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                name={key}
                value={(formData.experiencesProfessionnelles[idx] as any)[key]}
                onChange={(e) => handleArrayChange(e, 'experiencesProfessionnelles', idx)}
              />
            </div>
          ))}
          <div className="cv-field col-span-full">
            <label>Description</label>
            <textarea
              name="descriptionExp"
              value={formData.experiencesProfessionnelles[idx].descriptionExp}
              onChange={(e) => handleArrayChange(e, 'experiencesProfessionnelles', idx)}
            />
          </div>
          {/* Achievements */}
          <div className="cv-field col-span-full">
        <label>Réalisations</label>
        {exp.achievement.map((ach, aIdx) => (
          <div key={aIdx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={ach}
              onChange={(e) => {
                const updated = [...formData.experiencesProfessionnelles];
                updated[idx].achievement[aIdx] = e.target.value;
                setFormData({ ...formData, experiencesProfessionnelles: updated });
              }}
            />
            <button type="button" onClick={() => removeAchievementFromExperience(idx, aIdx)}>✖</button>
          </div>
        ))}
        <button type="button" className="cv-button-secondary" onClick={() => addAchievementToExperience(idx)}>
          + Ajouter une réalisation
        </button>
    
        </div>
        {/* Delete Button */}
        <button type="button" onClick={() => removeItemFromArray('experiencesProfessionnelles', idx)} className="text-red-500">
            ✖
          </button>
    </div>
  ))}
      <button className="cv-button-secondary" onClick={() => addItemToArray('experiencesProfessionnelles')}>
        + Ajouter une expérience
      </button>
    </section>

    {/* COMPETENCES */}
    <section className="cv-section">
      <h2 className="cv-section-title">Compétences</h2>
      {formData.competences.map((_, idx) => (
        <div key={idx} className="cv-grid-2">
          {['titre', 'description'].map((key) => (
            <div key={key} className="cv-field">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                name={key}
                value={(formData.competences[idx] as any)[key]}
                onChange={(e) => handleArrayChange(e, 'competences', idx)}
              />
            </div>
          ))}
          {/* Delete Button */}
          <button type="button" onClick={() => removeItemFromArray('competences', idx)} className="text-red-500">
            ✖
          </button>
        </div>
      ))}
      <button className="cv-button-secondary" onClick={() => addItemToArray('competences')}>
        + Ajouter une compétence
      </button>
    </section>

    {/* LANGUES */}
    <section className="cv-section">
      <h2 className="cv-section-title">Langues</h2>
      {formData.langues.map((_, idx) => (
        <div key={idx} className="cv-grid-2">
          {['intitule', 'niveau'].map((key) => (
            <div key={key} className="cv-field">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                name={key}
                value={(formData.langues[idx] as any)[key]}
                onChange={(e) => handleArrayChange(e, 'langues', idx)}
              />
            </div>
          ))}
          {/* Delete Button */}
          <button type="button" onClick={() => removeItemFromArray('langues', idx)} className="text-red-500">
            ✖
          </button>
        </div>
      ))}
      <button className="cv-button-secondary" onClick={() => addItemToArray('langues')}>
        + Ajouter une langue
      </button>
    </section>

    {/* LOISIRS */}
    <section className="cv-section">
      <h2 className="cv-section-title">Loisirs</h2>
      {formData.loisirs.map((_, idx) => (
        <div key={idx} className="cv-field">
          <input
            value={formData.loisirs[idx]}
            onChange={(e) => handleArrayChange(e, 'loisirs', idx)}
          />
          {/* Delete Button */}
          <button type="button" onClick={() => removeItemFromArray('loisirs', idx)} className="text-red-500">
            ✖
          </button>
        </div>
      ))}
      <button className="cv-button-secondary" onClick={() => addItemToArray('loisirs')}>
        + Ajouter un loisir
      </button>
    </section>
          {/* REFERENCES */}
          <section className="cv-section">
            <h2 className="cv-section-title">Références</h2>
            <div className="cv-grid-2">
              <div className="cv-field">
                <label>Email</label>
                <input
                  name="emailReference"
                  value={formData.emailReference}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="cv-field">
                <label>Téléphone</label>
                <input
                  name="telephoneReference"
                  value={formData.telephoneReference}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div className="cv-grid-2">
              <div className="cv-field">
                <label>Nom</label>
                <input
                  name="nomReference"
                  value={formData.nomReference}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="cv-field">
                <label>Relation</label>
                <input
                  name="relationReference"
                  value={formData.relationReference}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </section>

          <div className="text-center mt-8">
            <button className="cv-button" onClick={handleFormSubmit}>Soumettre le CV</button>
          </div>
        </>
      ) : (
        <div className="text-center mt-8">
          <button className="cv-button" onClick={handlePdfSubmit}>Soumettre le PDF</button>
        </div>
      )}

      {response && <p className="mt-4 text-green-600">{response}</p>}
    </div>
  );
}

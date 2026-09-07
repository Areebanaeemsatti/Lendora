import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { BorrowerApplication, EmploymentType } from '@/types';
import { User } from 'lucide-react';

interface Props {
  formData: BorrowerApplication;
  errors: Record<string, string>;
  onChange: (field: keyof BorrowerApplication, value: any) => void;
}

export function BasicInfoSection({ formData, errors, onChange }: Props) {
  const employmentOptions = [
    { value: 'Salaried', label: 'Salaried' },
    { value: 'Self-employed', label: 'Self-employed' },
    { value: 'Informal worker', label: 'Informal worker' },
    { value: 'Daily wage worker', label: 'Daily wage worker' },
    { value: 'Small business owner', label: 'Small business owner' },
    { value: 'Freelancer', label: 'Freelancer' },
  ];

  const provinceOptions = [
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Sindh', label: 'Sindh' },
    { value: 'Khyber Pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
    { value: 'Balochistan', label: 'Balochistan' },
    { value: 'Islamabad Capital Territory', label: 'Islamabad Capital Territory' },
    { value: 'Gilgit-Baltistan', label: 'Gilgit-Baltistan' },
    { value: 'Azad Jammu & Kashmir', label: 'Azad Jammu & Kashmir' },
  ];

  return (
    <Card id="section-1">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <User className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>Section 1: Basic Borrower Information</CardTitle>
            <CardDescription>
              Primary applicant identification and employment category
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Borrower / Application ID"
            value={formData.borrowerId}
            onChange={(e) => onChange('borrowerId', e.target.value)}
            error={errors.borrowerId}
            placeholder="e.g. LEN-PK-2026-01"
            helperText="System reference identifier for this applicant"
          />

          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            error={errors.fullName}
            placeholder="e.g. Muhammad Aslam Khan"
          />

          <Input
            label="Age"
            type="number"
            value={formData.age}
            onChange={(e) => onChange('age', e.target.value ? parseInt(e.target.value, 10) : '')}
            error={errors.age}
            placeholder="e.g. 34"
            min={18}
            max={85}
          />

          <Input
            label="City"
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            error={errors.city}
            placeholder="e.g. Lahore, Karachi, Peshawar"
          />

          <Select
            label="Province / Region"
            value={formData.province}
            onChange={(e) => onChange('province', e.target.value)}
            options={provinceOptions}
            placeholder="Select province..."
            error={errors.province}
          />

          <Input
            label="Occupation"
            value={formData.occupation}
            onChange={(e) => onChange('occupation', e.target.value)}
            error={errors.occupation}
            placeholder="e.g. Kiryana Store Owner / Electrician"
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <Select
              label="Employment Type"
              value={formData.employmentType}
              onChange={(e) => onChange('employmentType', e.target.value as EmploymentType)}
              options={employmentOptions}
              placeholder="Select employment category..."
              error={errors.employmentType}
              helperText="Helps contextualize income patterns and alternative financial evaluation."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

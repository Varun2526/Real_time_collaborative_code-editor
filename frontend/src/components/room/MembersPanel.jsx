import React, { useState } from 'react';

const MembersPanel = ({ 
  activeMembers, 
  currentUserId, 
  currentUserRole, 
  onMemberAction,
  pendingRequests = [],
  onApproveRequest,
  onRejectRequest
}) => {
  const [memberMenuOpenId, setMemberMenuOpenId] = useState(null);

  const handleAction = (action, userId) => {
    onMemberAction(action, userId);
    setMemberMenuOpenId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[rgba(240,240,250,0.35)]">
        <span className="text-spacex-nav">MEMBERS</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="flex flex-col gap-4 relative">
          {activeMembers.map((member, i) => (
            <div key={i} className="flex items-center justify-between gap-3 relative">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 border border-[rgba(240,240,250,0.35)] flex items-center justify-center text-spacex-body font-bold text-white uppercase">
                    {member.user.username?.[0] || member.user.name?.[0] || member.user.email?.[0] || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-black" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-spacex-body font-bold tracking-[1px] uppercase truncate">
                    {member.user.username || member.user.name || 'MEMBER'}
                  </span>
                  <span className="text-spacex-micro opacity-70">
                    {member.role === 'moderator' ? 'collaborator' : member.role}
                  </span>
                </div>
              </div>

              {/* Actions Menu */}
              {(currentUserRole === 'owner' || currentUserRole === 'moderator') &&
                (member.user._id !== currentUserId && member.user.id !== currentUserId) && (
                  <button
                    onClick={() =>
                      setMemberMenuOpenId(
                        memberMenuOpenId === (member.user._id || member.user.id)
                          ? null
                          : (member.user._id || member.user.id)
                      )
                    }
                    className="material-symbols-outlined text-white/50 hover:text-white cursor-pointer text-[18px] shrink-0"
                  >
                    more_vert
                  </button>
                )}

              {memberMenuOpenId === (member.user._id || member.user.id) && (
                <div className="absolute right-0 top-10 bg-black border border-[rgba(240,240,250,0.35)] py-2 z-50 w-48 text-spacex-nav">
                  {(currentUserRole === 'owner' || currentUserRole === 'moderator') && member.role === 'member' && (
                    <button
                      onClick={() => handleAction('promote', member.user._id || member.user.id)}
                      className="w-full text-left px-4 py-2 hover:bg-[rgba(240,240,250,0.1)] transition-colors"
                    >
                      PROMOTE TO COLLABORATOR
                    </button>
                  )}
                  {(currentUserRole === 'owner' || currentUserRole === 'moderator') && member.role === 'moderator' && (
                    <button
                      onClick={() => handleAction('demote', member.user._id || member.user.id)}
                      className="w-full text-left px-4 py-2 hover:bg-[rgba(240,240,250,0.1)] transition-colors"
                    >
                      DEMOTE TO MEMBER
                    </button>
                  )}
                  {currentUserRole === 'owner' && (
                    <button
                      onClick={() => handleAction('transfer', member.user._id || member.user.id)}
                      className="w-full text-left px-4 py-2 hover:bg-[rgba(240,240,250,0.1)] transition-colors"
                    >
                      TRANSFER OWNERSHIP
                    </button>
                  )}
                  {((currentUserRole === 'owner') || (currentUserRole === 'moderator' && member.role !== 'owner')) && (
                    <button
                      onClick={() => handleAction('remove', member.user._id || member.user.id)}
                      className="w-full text-left px-4 py-2 hover:bg-[rgba(255,51,51,0.2)] text-[#ff3333] transition-colors border-t border-[rgba(240,240,250,0.35)] mt-2"
                    >
                      REMOVE MEMBER
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pending Requests Section for Owners and Collaborators */}
        {(currentUserRole === 'owner' || currentUserRole === 'moderator') && pendingRequests.length > 0 && (
          <div className="mt-8 border-t border-[rgba(240,240,250,0.35)] pt-4">
            <div className="text-spacex-nav mb-4 text-[#ffcc00]">PENDING REQUESTS ({pendingRequests.length})</div>
            <div className="flex flex-col gap-4">
              {pendingRequests.map((req, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 bg-[rgba(240,240,250,0.05)] border border-[rgba(240,240,250,0.1)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-[rgba(240,240,250,0.35)] flex items-center justify-center text-spacex-micro font-bold text-white uppercase">
                      {req.username?.[0] || req.name?.[0] || 'U'}
                    </div>
                    <span className="text-spacex-body font-bold tracking-[1px] uppercase truncate">
                      {req.username || req.name || 'USER'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => onApproveRequest(req._id || req.id)}
                      className="flex-1 py-1 border border-white text-white hover:bg-white hover:text-black transition-colors text-[11px] font-bold tracking-widest"
                    >
                      ALLOW
                    </button>
                    <button 
                      onClick={() => onRejectRequest(req._id || req.id)}
                      className="flex-1 py-1 border border-[#ff3333] text-[#ff3333] hover:bg-[#ff3333] hover:text-black transition-colors text-[11px] font-bold tracking-widest"
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPanel;
